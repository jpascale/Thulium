const http = require('http')
		, debug = require('debug')('ws')
		, WebSocket = require('ws')
		, routeHandler = require('./routes')
	// , {Manager} = require("../manager/manager")
	// , {PSQLManager} = require("../manager/postgres_manager");


const createWebSocketServer = server => {

	debug('setting up thulium web socket server');

	const wss = new WebSocket.Server({ server });

	//Local variables
	let count = 0;
	let clients = {};

	wss.on('connection', (ws, req) => {

		const id = count++;
		clients[id] = ws;
		clients[id].id = id;

		routeHandler.resolveSession(ws, req, (err, session) => {
			if (err) {
				console.error(err);
				ws.close(108, 'Invalid session id');
				return;
			}

			debug(`Connection accepted [${id}]`);

			ws.on('message', message => {
				debug(`Received message from ${id}: ${message}`);

				routeHandler.route(ws, req, message, (err) => {
					if (err) {
						console.error(err);
					}
				});

				ws.send(message);
			});

			ws.send('Hello to Thulium!');
		});
	});

	return wss;
};

module.exports = createWebSocketServer;