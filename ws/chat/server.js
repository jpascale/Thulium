const debug = require('debug')('ws')
		, WebSocket = require('ws')
		, verifyClient = require('./verifyClient')
		, uuid = require('uuid/v4')
		, createRouter = require('./router')
		, redis = require('redis')
		, messageAdapter = require('./messageAdapter')
		, { Config } = require('@thulium/base');

const sub = redis.createClient({
	host: Config.storage.cache.host,
	password: Config.storage.cache.host
});
const clients = {};

const onJoin = (ws, req) => {

	const { user, booking } = req;

	const sender = (() => {
		if (user.role === 'sales') return 'sales';
		if (user.role === 'admin') return 'sales';
		return user.sub;
	})();

	// assign unique id
	const uid = uuid();
	ws.id = uid;
	clients[uid] = ws;

	debug(`joined USER=${sender} UID=${uid} BOOKING=${booking._id}`);
	debug(`clients are ${Object.keys(clients)}`);

	const SessionService = mongoose.connection.db.collection('sessions');

	SessionService.insertOne({
		owner: sender,
		booking: booking._id,
		uid
	}, err => {
		if (err) {
			console.error(err);
		}
	});
};

const onClose = (ws, req) => () => {
	const { user, booking } = req;

	const sender = (() => {
		if (user.role === 'sales') return 'sales';
		if (user.role === 'admin') return 'sales';
		return user.sub;
	})();

	debug(`closing USER=${sender} UID=${ws.id} BOOKING=${booking._id}`);

	const SessionService = mongoose.connection.db.collection('sessions');

	SessionService.remove({
		owner: sender,
		booking: booking._id,
		uid: ws.id
	}, (err) => {
		if (err) {
			console.error(err);
			return;
		}
		delete clients[ws.id];
		debug(`clients are ${Object.keys(clients)}`);
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

const SendMessages = require('./routes/sendMessages');

router.addAction('message', SendMessages.handler);
router.addAction('mark-as-read', require('./routes/markAsRead'));
router.addAction('list-messages', require('./routes/listMessages'));

const createWebSocketServer = server => {

	debug('setting up es web socket server');

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

		const { targets, message } = payload;

		targets.forEach(target => {
			if (clients[target]) {
				clients[target].send(JSON.stringify(messageAdapter(message)));
			}
		});
	});
	
	sub.subscribe('sent-message');

	return wss;
};

module.exports = createWebSocketServer;