const Status = require('http-status-codes')
		, jwt = require('jsonwebtoken')
		, { Config } = require('@thulium/base');

const extractToken = (req, res) => {
	if (req.headers.authorization) {
		return req.headers.authorization.replace(/^\s*Bearer/i, '').trim();
	}
	if (req.headers['x-access-token']) {
		return req.headers['x-access-token']
	}
	return req.query.token;
};

const verify = (token, next) => jwt.verify(token, Config.secret, Config.jwt, next);

const isUserValid = (req, res, next) => {
	const token = extractToken(req, res);
	if (!token) return next();
	verify(token, (err, user) => {
		if (err) return next(err);
		req.user = user;
		next();
	});
};

const validateUser = (req, res, next) => {
	isUserValid(req, res, (err) => {
		if (err) {
			return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
		}
		if (!req.user) {
			return res.status(Status.UNAUTHORIZED).json({ ok: 0, code: 'INVALID_TOKEN' });
		}
		next();
	});
};

module.exports = validateUser;
module.exports.isUserValid = isUserValid;