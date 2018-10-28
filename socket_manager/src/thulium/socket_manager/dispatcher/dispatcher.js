const http = require('http')
	, debug = require('debug')('socket_manager:dispatcher')
	, webSocketServer = require('websocket').server
	, {Manager} = require("../manager/manager.js")
	, {PSQLManager} = require("../manager/postgres_manager.js");

const Module = {};

Module.newConnection = function (port) {

	/*TODO CREATE WEBSOCKET ONLY IF ITS NOT ALREADY CREATED*/
	//Server start routine
	const server = http.createServer(function(request, response) {});

	server.listen(port, function() {
		debug('WebSocket Server is listening on port ' + port);
	});

	let wsServer = new webSocketServer({
		httpServer: server
	});

	//Local variables
	let count = 0;
	let clients = {};

	let managers = {'reverse': new Manager("reverse"), 'echo': new Manager("echo"), 'psql': new PSQLManager()};

	wsServer.on('request', function(r){
		// Only accept own protocol, and here initiate the connection (and can be accessed within this .js)
		const connection = r.accept('itba-db-protocol', r.origin);
		const id = count++;
		clients[id] = connection;
		/*Debug*/
		debug((new Date()) + ' Connection accepted [' + id + ']');


		const callbk = function(client,res){
			client.sendUTF(JSON.stringify(res));
			connection.close();
		};
		const errcallbk = function(client, res){
			client.sendUTF(JSON.stringify(res));
			connection.close();
		};

		// Create event listener
		connection.on('message', function(message) {

			// The string message that was sent to us; Format {"content":...,"engine":...}}
			const msgJSON = JSON.parse(message.utf8Data);
			/*Debug*/
			debug((new Date()) + ' Message received: ' + msgJSON.toString());

			//TODO SESSION CONTROL

			//TODO MANAGER ASKED COULD NOT BEEN IN ARRAY

			const manager = managers[msgJSON["engine"]];

			//TODO SECURITY CHECK OF QUERY

			//TODO ASK FOR EXPLAIN QUERY

			/*The magic (?*/
			manager.manage(msgJSON["content"], callbk, errcallbk, clients[id]);

		});

		connection.on('close', function(reasonCode, description) {
			delete clients[id];
			debug((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
		});
	});

};

module.exports = Module;