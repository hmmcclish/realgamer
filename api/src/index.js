// @flow
const Hapi = require('hapi');

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
        reply(require('../../data/json/platforms.json'));
    },
});

server.route({
    method: 'GET',
    path: '/platforms/{id}/games',
    handler: (request, reply) => {
        // for now, all platforms return the same games
        reply(require('../../data/json/games-sega-saturn.json'));
    },
});
