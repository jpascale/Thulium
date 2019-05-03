const Status = require('http-status-codes')
		, { Util } = require('@thulium/base');

const extractToken = req => {
	if (req.headers.authorization) {
		return req.headers.authorization.replace(/^\s*Bearer/i, '').trim();
	}
	if (req.headers['x-access-token']) {
		return req.headers['x-access-token']
	}
	return req.query.token;
};

const isUserValid = (req, res, next) => {
	const token = extractToken(req, res);
	if (!token) return next();
	Util.verifyToken(token, (err, user) => {
		if (err) return next(err);
		req.user = user;
		next();
	});
};

const validateUser = (req, res, next) => {
	isUserValid(req, res, (err) => {
		if (err || !req.user) {
			return res.status(Status.UNAUTHORIZED).json({ ok: 0, code: 'INVALID_TOKEN' });
		}
		next();
	});
};

module.exports = validateUser;
module.exports.isUserValid = isUserValid;