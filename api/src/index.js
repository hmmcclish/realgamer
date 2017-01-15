const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 3000, host: 'localhost' });

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
		const lines = require('fs').readFileSync('../data/platforms.csv').toString().trim().split('\n');
		lines.shift(); // skip first row
		const result = lines.map((line, id) => {
			const [manufacturer, name, year, generation] = line.split('\t');
			return {id, manufacturer, name, year, generation};
		});
		reply(result);
	},
})