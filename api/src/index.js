const Hapi = require('hapi');
const fs = require('fs');

const server = new Hapi.Server();

server.connection({port: 3003, host: 'localhost', routes: {cors: {origin: ['*']}}});

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
})

server.route({
    method: 'GET',
    path: '/platforms',
    handler: (request, reply) => {
        const result = fs.readFileSync('../data/platforms.csv').toString().trim().split('\n').slice(1).map((line, id) => {
            const [manufacturer, name, year, generation] = line.split('\t');
            return {id, manufacturer, name, year: +year, generation: +generation};
        });
        reply(result);
    },
});

server.route({
    method: 'GET',
    path: '/games',
    handler: (request, reply) => {
        const result = fs.readFileSync('../data/games-sega-saturn.csv').toString().trim().split('\n').slice(1).map((line, id) => {
            const [title, developer, publisher, yearNa, yearPal, yearJap] = line.split('\t');
            return {id, title, developer, publisher, year: +yearNa || +yearPal || +yearJap || 0};
        });
        reply(result);
    },
})
