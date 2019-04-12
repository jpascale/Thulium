const express = require('express')
	, router = express.Router({ mergeParams: true })
	, debug = require('debug')('api:core:v1:learn')
	, proxy = require('express-http-proxy')
	, async = require('async')
	, { Config } = require('@thulium/base')
	, superagent = require('superagent')
	, Status = require('http-status-codes')
	, validateUser = require('../../../middleware/validateUser')
	, { User } = require('@thulium/internal');

debug('setting up /core/v1/learn routes');

router.use('/',
	validateUser,
	(req, res, next) => {
		debug('fetching principal');
		User.findById(req.user.sub, (err, user) => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}

			req.user.db = user;
			next();
		});
	},
	(req, res, next) => {
		debug('checking token expiry');
		if (+req.user.db.bb_token_expiry > Date.now()) {
			debug('token has not expired');
			return next();
		}
		async.waterfall([
			cb => {
				debug(`refreshing token for ${req.user.db.email}`);
				superagent
				.post('https://itba-test.blackboard.com/learn/api/public/v1/oauth2/token')
				.type('form')
				.auth(Config.blackboard.APPLICATION_KEY, Config.blackboard.APPLICATION_SECRET)
				.send({
					grant_type: 'refresh_token',
					redirect_uri: Config.blackboard.REDIRECT_URI,
					refresh_token: req.user.db.bb_refresh_token
				})
				.end(cb);
			},
			(response, cb) => {
				debug('storing in db');
				const { access_token, expires_in, refresh_token } = response.body;
				req.user.db.bb_access_token = access_token;
				req.user.db.bb_token_expiry = Date.now() + (expires_in - 20) * 1000;
				req.user.db.bb_refresh_token = refresh_token;
				req.user.db.save(cb);
			}
		], next);
	},
	(req, res, next) => {
		debug('rewriting authorization');
		req.headers.authorization = `Bearer ${req.user.db.bb_access_token}`;
		next();
	},
	proxy('https://itba-test.blackboard.com', {
		proxyReqPathResolver: req => {
			debug(req.path);
			const path = `/learn/api/public${req.path.replace('/core/v1/learn/', '')}`
			debug(path);
			return path;
		}
	})
);

module.exports = router;