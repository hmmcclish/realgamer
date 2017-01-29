const Hapi = require('hapi');
const launchbox = require('./launchbox');

const server = new Hapi.Server();

server.connection({host: '0.0.0.0', port: process.env.PORT || 3003});

server.route({
    method: 'GET',
    path: '/launchbox/{id}',
    handler: (request, reply) => launchbox.fetchAll(request.params.id)
        .then(result => '<pre>' + JSON.stringify(result, null, '  ')) // remove this line
        .then(reply),
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('🚚  Server running at:', server.info.uri);
});
