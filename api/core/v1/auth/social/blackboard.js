const express		= require('express')
		, router		= express.Router({ mergeParams: true })
		, debug 		= require('debug')('api:core:v1:auth:social:blackboard')
		, Status = require('http-status-codes')
		, async = require('async')
		, superagent = require('superagent')
		, { Env, Config } = require('@thulium/base')
		, { User } = require('@thulium/internal')
		, normalizeEmail = require('validator/lib/normalizeEmail');


const decodeState = state => {

	const decoded = (state + Array(5 - state.length % 4).join('='))
		.replace(/\-/g, '+') // Convert '-' to '+'
		.replace(/\_/g, '/'); // Convert '_' to '/'
	
	const buffer = Buffer.from(decoded, 'base64');

	return JSON.parse(buffer.toString());
}

debug(Config);

router.get('/',
	(req, res, next) => {
		if (!req.query.code && !req.query.state) {
			console.log('user cancelled');
		}

		debug(req.query);

		const { code } = req.query;

		debug(`received code ${code}. Exchanging for token`);
		superagent
		.post('https://itba-test.blackboard.com/learn/api/public/v1/oauth2/token')
		.type('form')
		.send({
			grant_type: 'authorization_code',
			redirect_uri: Config.blackboard.REDIRECT_URI,
			code
		})
		.auth(Config.blackboard.APPLICATION_KEY, Config.blackboard.APPLICATION_SECRET)
		.end((err, response) => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}
			debug('received access token');
			debug(response.body);
			const { access_token, expires_in, refresh_token } = response.body;

			req.accessToken = access_token;
			req.expiresIn = expires_in - 20;
			req.refreshToken = refresh_token;

			next();
			
		});
	},
	(req, res, next) => {		

		debug('querying user profile');
		superagent
		.get('https://itba-test.blackboard.com/learn/api/public/v1/users/me')
		.set('Authorization', `Bearer ${req.accessToken}`)
		.end((err, { body }) => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}
			debug(body);
			debug('received user profile');
			const { contact, name, userName, id } = body;
			req.profile = {
				email: normalizeEmail(contact.email, { gmail_remove_dots: false }),
				first_name: name.given,
				last_name: name.family,
				role: 'student',
				bb_id: id,
				bb_username: userName,
				bb_access_token: req.accessToken,
				bb_refresh_token: req.refreshToken,
				bb_token_expiry: Date.now() + req.expiresIn * 1000
			};
			debug(req.profile);

			next();
		});
	},
	(req, res, next) => {
		const { email } = req.profile;
		debug(`fetching user by email ${email}`);
		User.findOne({ email }, (err, user) => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}

			req._user = user;

			next();
		});
	},
	(req, res, next) => {

		if (!req._user) {

			debug('user was not found. creating');

			User.create(req.profile, (err, user) => {
				if (err) {
					console.error(err);
					return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
				}
				req.user = user;
				next();
			});
			return;
		}

		debug('updating user');
		req.user = req._user;
		Object.assign(req.user, req.profile);

		req.user.save(err => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}

			next();
		});
	},
	(req, res) => {

		const { state } = req.query;
		const params = (() => {
			try {
				return decodeState(state);
			} catch (e) {
				return {};
			}
		})();

		req.user.generateJWT((err, token) => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}

			res.cookie('X-Access-Token', token, {
				domain: '.thulium.xyz'
			});

			res.redirect(Env.select({
				development: `http://localhost:3010${params.callback || '/'}`,
				production: `https://thulium.xyz${params.callback || '/'}`
			}));

		});
	}
);

module.exports = router;