const { Session } = require('@thulium/internal')
		, ThuliumHandler = require('./handlers');

const resolveSession = (ws, req, cb) => {
	const sessionID = (() => {
		const match = req.url.match(/^\/([a-f0-9]+)/);
		if (!match) return null;
		return match[1];
	})();

	if (!sessionID) {
		return cb(new Error('invalid session id'));
	}

	Session.findById(sessionID).exec((err, session) => {
		if (err) return cb(err);
		if (!session) return cb(new Error('Session not found'));
		return cb(null, session);
	});
};

const route = (ws, req, rawMessage, done) => {

	const message = (() => {
		try {
			return JSON.parse(rawMessage);
		} catch (e) {
			return null;
		}
	});

	if (!message || !message.type || !message.payload) {
		return cb(new Error('invalid message format'));
	}

	ThuliumHandler.handle(ws, req, message, done);
};

module.exports = {
	resolveSession,
	route
}