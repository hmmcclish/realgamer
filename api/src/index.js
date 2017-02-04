const Hapi = require('hapi');
const fs = require('fs');

const server = new Hapi.Server();

server.connection({port: 3003, host: '0.0.0.0', routes: {cors: {origin: ['*']}}});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        reply('Hi!\n');
    },
});

server.route({
    method: 'GET',
    path: '/platforms',
    handler: (request, reply) => {
        const result = fs.readFileSync('../data/csv/platforms.csv').toString().trim().split('\n').slice(1).map((line, id) => {
            const [name, manufacturer, year, isHandheld, generation, wikipediaUrl, image, logoSvg, logoPng] = line.split('\t');
            return {id, manufacturer, name, year: +year, generation: +generation, image, isHandheld: !!+isHandheld, wikipediaUrl, logoSvg, logoPng};
        });
        reply(result);
    },
});

server.route({
    method: 'GET',
    path: '/platforms/{id}/games',
    handler: (request, reply) => {
        const result = fs.readFileSync('../data/csv/games-sega-saturn.csv').toString().trim().split('\n').slice(1).map((line, id) => {
            const [title, developer, publisher, yearNa, yearPal, yearJap] = line.split('\t');
            return {id, title, platformId: request.params.id, developer, publisher, year: +yearNa || +yearPal || +yearJap || 0};
        });
        reply(result);
    },
});
