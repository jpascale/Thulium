const Status = require('http-status-codes')
		, jwt = require('jsonwebtoken')
		, { Config } = require('@thulium/base');

const validateUser = (req, res, next) => {
	const token = (() => {
		if (req.headers.authorization) {
			return req.headers.authorization.replace(/^\s*Bearer/i, '').trim();
		}
		if (req.headers['x-access-token']) {
			return req.headers['x-access-token']
		}
		return req.query.token;
	})();
	if (!token) return res.status(Status.UNAUTHORIZED).json({ ok: 0, code: 'INVALID_TOKEN' });
	jwt.verify(token, Config.secret, Config.jwt, (err, decoded) => {
		if (err) {
			return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
		}
		if (!decoded) {
			return res.status(Status.UNAUTHORIZED).json({ ok: 0, code: 'INVALID_TOKEN' });
		}
		req.user = decoded;
		next();
	});
};

module.exports = validateUser;