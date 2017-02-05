/* @flow */
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const c = require('colors');

const last = arr => arr[arr.length - 1];
const upper = s => String(s).toUpperCase();
const flatMap = (a, cb) => [].concat(...a.map(cb));
const skipLast = arr => Array.from(arr).slice(0, -1);
const skipFirst = arr => Array.from(arr).slice(1, arr.length);
const removeParens = s => String((s.startsWith('(') && s.endsWith(')')) ? skipFirst(skipLast(s)) : s);
const makeIsoDate = s => new Date(s).toISOString();
const unique = arr => Array.from(new Set(arr));
const str = s => String(s === 0 ? '0' : (s || ''));

const SEPARATOR = /\s*\|\s*/;
const CSV_SEPARATOR = /\t/;
const SPACE = /\s+/;
const NEW_LINE = /\s*\n+\s*/;
const COMMENT = /\(.*?\)$/;
const REGIONS = 'AU,EU,JP,FR,PAL,NA,US,BR,KR'.split(',');

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
    const title = removeParens(String(dirtyTitle).trim()).trim();
    const words = title.split(SPACE);
    if (!title.length) {
        return [];
    }

    const result = {name: title, comment: ''};
    const lastWord = upper(removeParens(last(words)));

    const regions = lastWord.split('/');

    // check if last word is a region indicator
    if (regions.every(r => REGIONS.includes(r))) {
        const name = skipLast(words).join(' ');
        result.name = name;
        if (COMMENT.test(name)) {
            result.name = name.replace(COMMENT, '').trim();
            const matches = name.match(COMMENT);
            if (Array.isArray(matches) && matches.length) {
                result.comment = removeParens(matches[0]);
            }
        }
        return regions.map(region => Object.assign({}, result, {region})).filter(Boolean);
    }

    // check if title has a comment
    if (COMMENT.test(title)) {
        result.name = title.replace(COMMENT, '').trim();
        const matches = title.match(COMMENT);
        if (Array.isArray(matches) && matches.length) {
            result.comment = removeParens(matches[0]);
        }
    }
    return [result];
});

const parseDateWithRegion = dates =>
    parseStringWithRegion(dates).map(data => {
        const res = Object.assign({}, data);
        if (upper(res.name) === 'UNRELEASED') {
            res.unreleased = true;
        } else {
            res.date = makeIsoDate(res.name);
        }
        delete res.name;
        return res;
    });

const parsePlatform = (line) => {
    const [name, developer, releaseDate, handheld, generation, wikipediaUrl, imageUrl] = line.split(CSV_SEPARATOR);
    return {
        title: parseStringWithRegion(name),
        developer: parseStringWithRegion(developer),
        releaseDate: parseDateWithRegion(releaseDate),
        handheld: Boolean(+handheld),
        generation: +generation,
        wikipediaUrl,
        imageUrl,
    };
};

const parseSegaSaturnGame = (line) => {
    const [title, developer, publisher, NA, PAL, JP] = line.split(CSV_SEPARATOR);
    const dates = `${NA ? `${NA} (NA)` : ''}|${PAL ? `${PAL} (PAL)` : ''}|${JP ? `${JP} (JP)` : ''}`;
    return {
        title: parseStringWithRegion(title || ''),
        releaseDate: parseDateWithRegion(dates),
        developer: parseStringWithRegion(developer || ''),
        publisher: parseStringWithRegion(publisher || ''),
    };
};

const parseSonyPlayStationGame = (line) => {
    const [title, developer, publisher, JP, EU, NA] = line.split(CSV_SEPARATOR);
    const dates = `${NA ? `${NA} (NA)` : ''}|${EU ? `${EU} (EU)` : ''}|${JP ? `${JP} (JP)` : ''}`;
    return {
        title: parseStringWithRegion(title || ''),
        releaseDate: parseDateWithRegion(dates),
        developer: parseStringWithRegion(developer || ''),
        publisher: parseStringWithRegion(publisher || ''),
    };
};

const parseSnesGame = (line) => {
    const [mainTitle, naTitle, euTitle, jpTitle, altTitle, /* region */, genre, subgenre] = line.split(CSV_SEPARATOR);
    const titles = [mainTitle];
    if (naTitle && naTitle !== mainTitle) {
        titles.push(naTitle + ' (NA)');
    }
    if (euTitle && euTitle !== mainTitle) {
        titles.push(euTitle + ' (EU)');
    }
    if (jpTitle && jpTitle !== mainTitle) {
        titles.push(jpTitle + ' (JP)');
    }
    if (altTitle) {
        titles.push(altTitle);
    }
    return {
        title: parseStringWithRegion(unique(titles).join('|')),
        genre: str(genre).split(SEPARATOR).filter(Boolean),
        subgenre: str(subgenre).split(SEPARATOR).filter(Boolean),
    };
};

const parseFile = (csvPath) => {
    const csvFilename = path.basename(csvPath);
    const lines = skipFirst(fs.readFileSync(csvPath).toString().trim().split(NEW_LINE));
    switch (csvFilename) {
        case 'games-sega-saturn.csv':
            return lines.map(parseSegaSaturnGame);
        case 'games-sony-playstation.csv':
            return lines.map(parseSonyPlayStationGame);
        case 'games-snes.csv':
            return lines.map(parseSnesGame);
        case 'platforms.csv':
            return lines.map(parsePlatform);
        default:
            console.log(c.red('unhandled:'), csvFilename);
            return {};
    }
};

glob('./csv/*.csv', {}, (err, files) => {
    if (err) throw err;
    files.forEach(csvPath => {
        const result = parseFile(csvPath);
        const json = JSON.stringify(result, null, '  ');
        const csvFilename = path.basename(csvPath);
        const jsonPath = path.join(path.dirname(csvPath), '../json', csvFilename.replace(/\.csv$/, '.json'));
        console.log(c.green('write: '), jsonPath);
        fs.writeFileSync(jsonPath, json);
    });
});
