const { Session } = require('@thulium/internal');

const wssRouteHandler = (ws, req, cb) => {
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
}

module.exports = {
	resolveSession: wssRouteHandler
}