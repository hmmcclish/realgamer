const cheerio = require('cheerio');
const fetch = require('isomorphic-fetch');
require('colors');

const booleanize = s => ['yes', 'true', true].includes(s.toLowerCase());
const skipFirst = a => a.slice(1, a.length);
const last = (a, i) => a.slice(a.length - i, a.length);
const parseDate = s => new Date(Date.parse(s)).toISOString();
const fixText = s => s.replace(/\r/g, '').replace(/ +/g, ' ');
const camelize = s => s
    .toLowerCase()
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (c, i) => i ? c.toUpperCase() : c.toLowerCase())
    .replace(/\s+/g, '');

const fetchInfo = id => fetch('http://gamesdb.launchbox-app.com/games/details/' + id)
    .then(res => res.text())
    .then(html => {
        console.log('fetch:'.green, 'http://gamesdb.launchbox-app.com/games/details/' + id);
        const $ = cheerio.load(html);
        const $trs = $('.table-details > tr');
        const result = {
            source: 'http://gamesdb.launchbox-app.com',
            sourceId: id,
            title: [],
            releaseDate: [],
        };
        $trs.each((i, tr) => {
            const $tds = $('td', tr);
            const field = camelize($tds.eq(0).text().trim());
            const $values = $('.view', $tds);
            const v1 = $values.eq(0).text().trim() || $('#communityRating', $tds).text().trim();
            const v2 = $values.eq(1).text().trim() || $('#totalVotes', $tds).text().trim();
            const va = $('a', $values).map((i, v) => $(v).text().trim()).get().filter(Boolean);
            if (!v1) {
                console.log('not set:'.magenta, field);
                return;
            }
            switch (field) {
                case 'name':
                    result.title.push({name: v1});
                    break;
                case 'alternateName':
                    result.title.push({name: v1, region: v2});
                    break;
                case 'platform':
                case 'esrb':
                    result[field] = v1;
                    break;
                case 'releaseDate':
                    result.releaseDate.push({date: parseDate(v1)});
                    break;
                case 'developers':
                case 'publishers':
                    result[field] = va.map(v => ({name: v}));
                    break;
                case 'genres':
                    result.genre = va;
                    break;
                case 'maxPlayers':
                    result.maxPlayers = +v1;
                    break;
                case 'cooperative':
                    result.cooperative = booleanize(v1);
                    break;
                case 'rating':
                    result.rating = {value: +v1, votes: +v2};
                    break;
                case 'videoLink':
                    result.video = va.map(url => ({url}));
                    break;
                case 'overview':
                    result.overview = {text: fixText(v1), lang: 'en'};
                    break;
                case 'addAlternateName':
                    // ignore
                    break;
                default:
                    console.log('Unhandled field:'.red, field);
            }
        });
        console.log('🏁 ', result.title[0].name.gray, '\n');
        return result;
    });

const fetchPhoto = id => fetch('http://gamesdb.launchbox-app.com/games/images/' + id)
    .then(r => r.text())
    .then(html => {
        console.log('fetch:'.green, 'http://gamesdb.launchbox-app.com/games/images/' + id);
        const $ = cheerio.load(html);
        const $as = $('.image-list a');
        const images = [];
        $as.each((i, a) => {
            const title = $(a).data('title');
            if (!title) {
                return;
            }
            const url = $(a).attr('href').trim();
            const tags = last(skipFirst(title.trim().toLowerCase().split(/\s+-\s+/)), 2);
            images.push({tags, url});
        });
        return {images};
    });

const fetchAll = (id) => Promise.all([
    fetchInfo(id),
    fetchPhoto(id),
]).then(([info, imgs]) =>
    Object.assign({}, info, imgs))
.catch(err => console.log(err));

module.exports = {fetchAll};
