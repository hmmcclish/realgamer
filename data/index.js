const fs = require('fs');
const path = require('path');
const glob = require('glob');
const colors = require('colors');

const last = arr => arr[arr.length - 1];
const upper = s => s.toUpperCase();
const flatMap = (a, cb) => [].concat(...a.map(cb));
const skipLast = arr => arr.slice(0, -1);
const skipFirst = arr => arr.slice(1, arr.length);
const removeParens = s => (s.startsWith('(') && s.endsWith(')')) ? skipFirst(skipLast(s)) : s;
const trim = s => s.trim();

const SEPARATOR = /\s*\|\s*/;
const SPACE = /\s+/;
const NEW_LINE = /\s*\n+\s*/;
const COMMENT = /\(.*?\)$/
const REGIONS = 'EU,JP,FR,PAL,NA,US'.split(',');

/**
 * Parses strings like:
 * 
 *     "Crystal Dynamics (NA)|BMG Entertainment (EU/JP)" -> returns 3 items
 *     "Dragon Ball Z: Idainaru Dragon Ball Densetsu (JP)|Dragon Ball Z: The Legend pal"
 *     "Die Hard Arcade|Dynamite Deka JP"
 *     "Layer Section|(RayForce Arcade)|(Galactic Attack NA/EU)" -> remove extra parens
 *     "CRI|Satakore (re-release)" -> re-release as comment
 * 
 * and returns one or more elements with the specified mapping structure
 * 
 * - Strings are splitted by '|'
 * - Multiple regions can be specified separating them with slashes ('/')
 * - Assumes that the region is located at the end of the string
 * - Assumes that the last chunk beween parens before the region is a comment
 */
const parseStringWithRegion = dirtyTitle => {
    const title = removeParens(dirtyTitle.trim()).trim();
    const words = title.split(SPACE);    
    if (!title.length) {
        return [];
    }

    const result = {name: title};
    const lastWord = upper(removeParens(last(words)));

    const regions = lastWord.split('/');
    if (regions.every(r => REGIONS.includes(r))) {
        const name = skipLast(words).join(' ');
        const result = {name};
        if (COMMENT.test(name)) {
            result.name = name.replace(COMMENT, '').trim();
            result.comment = removeParens(name.match(COMMENT)[0]);
        }
        return regions.map(region => Object.assign({}, result, {region}));
    }
    if (COMMENT.test(title)) {
        result.name = title.replace(COMMENT, '').trim();
        result.comment = removeParens(title.match(COMMENT)[0]);
    }
    return result;
};

const parseSegaSaturnGame = (line) => {
    const [title, developer = '', publisher = '', NA = '', PAL = '', JP = ''] = line.split(/\t/);
    const releaseDate = [];
    const dates = {NA, PAL, JP};
    Object.keys(dates).map(trim).map(upper).forEach(region => {
        const date = dates[region];
        if (upper(date) === 'UNRELEASED') {
            releaseDate.push({region, unreleased: true});
        } else if (date) {
            const isoDate = new Date(date).toISOString();
            releaseDate.push({date: isoDate, region});
        }
    });
    const game = {        
        title: flatMap(title.split(SEPARATOR), parseStringWithRegion),
        releaseDate,
        developer: flatMap(developer.split(SEPARATOR), parseStringWithRegion).filter(Boolean),
        publisher: flatMap(publisher.split(SEPARATOR), parseStringWithRegion).filter(Boolean),
    };
    return game;
};

const parseFile = (csvPath) => {
    const csvFilename = path.basename(csvPath);
    const lines = skipFirst(fs.readFileSync(csvPath).toString().trim().split(NEW_LINE));
    switch (csvFilename) {
        case 'games-sega-saturn.csv':
            return lines.map(parseSegaSaturnGame);
        default: 
            console.log('unhandled:'.red, csvFilename);
            return {};
    }
};

glob("./csv/*.csv", {}, (err, files) => {
    if (err) throw err;
    files.forEach(csvPath => {
        const result = parseFile(csvPath);
        const json = JSON.stringify(result, null, '  ');
        const csvFilename = path.basename(csvPath);
        const jsonPath = path.join(path.dirname(csvPath), '../json', csvFilename.replace(/\.csv$/, '.json'));
        console.log('write: '.green, jsonPath);
        console.log(json);
        fs.writeFileSync(jsonPath, json);
    });
});
