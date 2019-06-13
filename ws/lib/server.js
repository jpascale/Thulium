const debug = require('debug')('ws')
		, WebSocket = require('ws')
		, verifyClient = require('./verifyClient')
		, uuid = require('uuid/v4')
		, createRouter = require('./router')
		, redis = require('redis')
		, messageAdapter = require('./messageAdapter')
		, { Config } = require('@thulium/base')
		, { jobs } = require('@thulium/jobs')
		, zmq = require('zeromq');


const subscriber = zmq.socket('sub');

subscriber.connect(`tcp://${Config.storage.pubsub.host}:${Config.storage.pubsub.port}`);
debug(`Subscriber connected to port ${Config.storage.pubsub.port}`);

const sub = redis.createClient({
	host: Config.storage.cache.host,
	password: Config.storage.cache.password
});
const clients = {};

const onJoin = (ws, req) => {

	const { token, user, session } = req;

	// assign unique id
	const uid = uuid();
	ws.id = uid;
	clients[uid] = ws;

	debug(`joined USER=${user.email} UID=${uid}`);
	debug(`clients are ${Object.keys(clients)}`);
	
	session.ws.push(uid);
	session.markModified('ws');

	session.save(err => {
		if (err) {
			console.error(err);
		}
	});
};

const onClose = (ws, req) => () => {
	const { token, user, session } = req;

	debug(`joined USER=${user.email} UID=${ws.id}`);

	delete clients[ws.id];
	debug(`clients are ${Object.keys(clients)}`);

	const idx = session.ws.indexOf(ws.id);
	if (!~idx) return;
	session.ws.splice(idx, 1);
	session.markModified('ws');
	session.save(err => {
		if (err) {
			console.error(err);
			return;
		}
	});
};

const router = createRouter({
	onJoin,
	onClose,
	messageVerifier: (message, done) => {
		done(null, message.action && message.data)
	},
	messageAdapter: (action, message, done) => {
		done(null, message.data);
	}
});

const routes = require('./routes/');

Object.keys(routes).forEach(k => {
	router.addAction(k, routes[k]);
});

const createWebSocketServer = server => {

	debug('setting up web socket server');

	const wss = new WebSocket.Server({
		server,
		verifyClient
	});
	
	wss.on('connection', router.connectionHandler);

	const interval = setInterval(() => {
		wss.clients.forEach(ws => {
			if (ws.isAlive === false) {
				debug(`terminating UID=${ws.id}`);
				delete clients[ws.id];
				return ws.terminate();
			}
	
			ws.isAlive = false;
			ws.ping(() => {});
		});
	}, 30000);

	sub.on('message', (channel, rawMessage) => {
		const payload = (() => {
			try {
				return JSON.parse(rawMessage);
			} catch (e) {
				return null;
			}
		})();

		if (!payload) return;

		debug(payload);

		// const { targets, message } = payload;

		// targets.forEach(target => {
		// 	if (clients[target]) {
		// 		clients[target].send(JSON.stringify(messageAdapter(message)));
		// 	}
		// });
	});
	
	sub.subscribe('sent-message');

	// subscribe to zeromq topics here using jobs export
	Object.values(jobs).forEach(key => {
		debug('subscribing to key %s', key);
		subscriber.subscribe(key);
		subscriber.subscribe(`${key}:error`);
	});
	subscriber.on('message', function(topic, message) {
		console.log('received a message related to:', topic.toString(), 'containing message:', message.toString());
	});
	
	
	// 	subscriber
	// 	subscriber.on(key, function () {
	// 		debug(key);
	// 		const msg = Array.prototype.slice.call(arguments).map(arg => arg.toString());
	// 		console.log(msg);
	// 	});
	// 	subscriber.on(`${key}:error`, function () {
	// 		debug(`${key}:error`);
	// 		const msg = Array.prototype.slice.call(arguments).map(arg => arg.toString());
	// 		console.log(msg);
	// 	});
	// });
	

	return wss;
};

module.exports = createWebSocketServer;