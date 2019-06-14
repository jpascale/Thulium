const debug = require('debug')('ws')
		, WebSocket = require('ws')
		, verifyClient = require('./verify-client')
		, uuid = require('uuid/v4')
		, createRouter = require('./router')
		, messageAdapter = require('./message-adapter')
		, { Config } = require('@thulium/base')
		, { Session } = require('@thulium/internal')
		, { jobs } = require('@thulium/jobs')
		, zmq = require('zeromq');


const subscriber = zmq.socket('sub');

subscriber.connect(`tcp://${Config.storage.pubsub.host}:${Config.storage.pubsub.port}`);
debug(`Subscriber connected to port ${Config.storage.pubsub.port}`);

const clients = {};

const onJoin = (ws, req) => {

	const { token, user, session } = req;

	// assign unique id
	const uid = uuid();
	ws.id = uid;
	clients[uid] = ws;

	debug(`joined USER=${user.email} UID=${uid}`);
	debug(`clients are ${Object.keys(clients)}`);

	Session.collection.updateOne({
		_id: session._id
	}, {
		$push: { ws: uid }
	}, err => {
		if (err) {
			console.error(err);
		}
	});
	
	// session.ws.push(uid);
	// session.markModified('ws');

	// session.save();
};

const onClose = (ws, req) => () => {
	const { token, user, session } = req;

	debug(`left USER=${user.email} UID=${ws.id}`);

	delete clients[ws.id];
	debug(`clients are ${Object.keys(clients)}`);

	Session.collection.updateOne({
		_id: session._id
	}, {
		$pull: {
			ws: ws.id
		}
	}, err => {
		if (err) {
			console.error(err);
			return;
		}
	});

	// const idx = session.ws.indexOf(ws.id);
	// if (!~idx) return;
	// session.ws.splice(idx, 1);
	// session.markModified('ws');
	// session.save(err => {
	// 	if (err) {
	// 		console.error(err);
	// 		return;
	// 	}
	// });
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

	// subscribe to zeromq topics here using jobs export
	Object.values(jobs).forEach(key => {
		debug('subscribing to key %s', key);
		subscriber.subscribe(key);
		subscriber.subscribe(`${key}:error`);
	});
	subscriber.on('message', (rawTopic, rawMessage) => {
		const topic = rawTopic.toString();
		const message = (() => {
			try {
				return JSON.parse(rawMessage.toString());
			} catch (err) {
				return null;
			}
		})();
		if (!message) {
			debug('discarding message');
			return;
		}
		if (!message.scope) {
			debug('no scope defined in message');
			return;
		}

		debug('TOPIC=%s MESSAGE=%o', topic, message);
		
		message.scope.forEach(uid => {
			if (!clients[uid]) return;
			debug('client %s is here', uid);
			clients[uid].send(JSON.stringify({
				topic,
				message
			}));
		});
	});
	

	return wss;
};

module.exports = createWebSocketServer;