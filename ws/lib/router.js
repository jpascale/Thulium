const async = require('async')
		, debug = require('debug')('es:chat:router');

const builtinDefaultHandler = (ws, req, message, next) => next();

const builtinErrorHandler = (err, ws, req) => {
	if (err) {
		console.error(err);
	}
};

const jsonMessageParser = (rawMessage, done) => {
	const message = (() => {
		try {
			return JSON.parse(rawMessage);
		} catch (e) {
			return null;
		}
	})();

	if (!message) {
		return done(new Error('invalid json'));
	}
	done(null, message);
};

const builtinOnJoin = () => {};
const builtinOnClose = () => {};
const acceptAllMessages = (message, done) => {
	done(null, true);
};

const builtinMessageToAction = (message, done) => {
	done(null, message.action);
};

const builtinMessageAdapter = (message, done) => {
	done(null, message);
};

const createRouter = ({
	defaultHandler = builtinDefaultHandler,
	errorHandler = builtinErrorHandler,
	messageParser = jsonMessageParser,
	onJoin = builtinOnJoin,
	onClose = builtinOnClose,
	messageVerifier = acceptAllMessages,
	messageToAction = builtinMessageToAction,
	messageAdapter = builtinMessageAdapter
}) => {
	const Router = {};

	Router._defaultHandler = defaultHandler;
	Router._errorHandler = errorHandler;
	Router._messageParser = messageParser;
	Router._onJoin = onJoin;
	Router._onClose = onClose;
	Router._messageVerifier = messageVerifier;
	Router._messageToAction = messageToAction;
	Router._messageAdapter = messageAdapter;

	const routes = {};

	Router.addAction = (action, handler) => {
		debug(`adding ${action} handler`);
		routes[action] = handler;
		return Router;
	};
	Router.defaultHandler = handler => {
		Router._defaultHandler = handler;
		return Router;
	};
	Router.errorHandler = handler => {
		Router._errorHandler = handler;
		return Router;
	};
	Router.messageParser = parser => {
		Router._messageParser = parser;
		return Router;
	};
	Router.messageVerifier = verifier => {
		Router._messageVerifier = verifier;
		return Router;
	};
	Router.messageToAction = mapper => {
		Router._messageToAction = mapper;
		return Router;
	};
	Router.messageAdapter = mapper => {
		Router._messageAdapter = mapper;
		return Router;
	};
	Router.onJoin = mapper => {
		Router._onJoin = mapper;
		return Router;
	};
	Router.onClose = mapper => {
		Router._onClose = mapper;
		return Router;
	};

	Router._messageRouter = (ws, req) => rawMessage => {
		async.waterfall([
			next => {
				debug(`parsing message: ${rawMessage}`);
				Router._messageParser(rawMessage, next);
			},
			(message, next) => {
				debug('verifying message');
				debug(message);
				Router._messageVerifier(message, (err, verified) => {
					if (err) return next(err);
					if (verified) {
						debug('message was verified');
						return next(null, message);
					}
					next(new Error('message not verified'));
				});
			},
			(message, next) => {
				debug('mapping message to action');
				Router._messageToAction(message, (err, action) => {
					if (err) return next(err);
					debug(`message has action ${action}`);
					next(null, action, message);
				});
			},
			(action, message, next) => {
				debug('adapting message');
				Router._messageAdapter(action, message, (err, adaptedMessage) => {
					if (err) return next(err);
					next(null, action, adaptedMessage);
				});
			},
			(action, message, next) => {
				debug(`handling action: ${action} with message %o`, message);
				const handler = routes[action];
				if (handler) {
					return handler(ws, req, message, next);
				}
				Router.defaultHandler(ws, req, message, next);
			}
		], err => {
			if (err) {
				return Router._errorHandler(err, ws, req);
			}
		});
	};

	Router.connectionHandler = (ws, req) => {

		ws.isAlive = true;
		ws.on('pong', () => {
			ws.isAlive = true;
		});

		debug('connected');

		Router._onJoin(ws, req);

		ws.on('message', Router._messageRouter(ws, req));
		ws.on('close', Router._onClose(ws, req));
		ws.on('error', Router._errorHandler);
	};

	return Router;
};

module.exports = createRouter;
module.exports.jsonMessageParser = jsonMessageParser;