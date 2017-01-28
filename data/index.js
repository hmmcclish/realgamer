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
const makeIsoDate = s => new Date(s).toISOString();
const trim = s => s.trim();

const SEPARATOR = /\s*\|\s*/;
const CSV_SEPARATOR = /\t/;
const SPACE = /\s+/;
const NEW_LINE = /\s*\n+\s*/;
const COMMENT = /\(.*?\)$/
const REGIONS = 'EU,JP,FR,PAL,NA,US,BR'.split(',');

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
const parseStringWithRegion = str => flatMap(str.split(SEPARATOR), dirtyTitle => {
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
        return regions.map(region => Object.assign({}, result, {region})).filter(Boolean);
    }
    if (COMMENT.test(title)) {
        result.name = title.replace(COMMENT, '').trim();
        result.comment = removeParens(title.match(COMMENT)[0]);
    }
    return [result];
});

const parseDateWithRegion = dates => {
    return parseStringWithRegion(dates).map(res => {
        if (upper(res.name) === 'UNRELEASED') {
            res.unreleased = true;
        } else {
            res.date = makeIsoDate(res.name);
        }
        delete res.name;
        return res;
    });
};

const parseSegaSaturnGame = (line) => {
    const [title, developer = '', publisher = '', NA = '', PAL = '', JP = ''] = line.split(CSV_SEPARATOR);
    const dates = `${NA ? `${NA} (NA)` : ''}|${PAL ? `${PAL} (PAL)` : ''}|${JP ? `${JP} (JP)` : ''}`;
    const game = {        
        title: parseStringWithRegion(title),
        releaseDate: parseDateWithRegion(dates),
        developer: parseStringWithRegion(developer),
        publisher: parseStringWithRegion(publisher),
    };
    return game;
};

const parsePlatform = (line) => {
    const [name, developer, releaseDate, handheld, generation, wikipediaUrl, imageUrl] = line.split(CSV_SEPARATOR);
    const platform = {
        title: parseStringWithRegion(name),
        developer: parseStringWithRegion(developer),
        releaseDate: parseDateWithRegion(releaseDate),
        handheld: Boolean(handheld),
        generation: +generation,
        wikipediaUrl,
        imageUrl,
    };
    return platform;
};

const parseFile = (csvPath) => {
    const csvFilename = path.basename(csvPath);
    const lines = skipFirst(fs.readFileSync(csvPath).toString().trim().split(NEW_LINE));
    switch (csvFilename) {
        case 'games-sega-saturn.csv':
            return lines.map(parseSegaSaturnGame);
        case 'platforms.csv':
            return lines.map(parsePlatform);
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
        fs.writeFileSync(jsonPath, json);
    });
});
