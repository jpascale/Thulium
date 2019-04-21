const express = require('express')
	, router = express.Router({ mergeParams: true })
	, debug = require('debug')('api:core:v1:learn')
	, proxy = require('express-http-proxy')
	, async = require('async')
	, { Config } = require('@thulium/base')
	, superagent = require('superagent')
	, Status = require('http-status-codes')
	, validateUser = require('../../../middleware/validateUser')
	, { User, Exam } = require('@thulium/internal');

debug('setting up /core/v1/learn routes');

router.use('/graphql', require('./graphql'));

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
		const isPublishingExam = /createAssignment$/.test(req.path);
		if (!isPublishingExam) return next();
		req.publishExam = true;
		Exam.create({}, (err, exam) => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}
			req.body.instructions = `<!-- Thulium Exam -->
			<div>
				Navigate to
				<a href="http://localhost:3010/?exam=${exam._id}">
					http://localhost:3010/?exam=${exam._id}
				</a>
			</div>`;
			req.body.description = 'Thulium Exam';
			req.exam = exam;
			next();
		});
	},
	proxy('https://itba-test.blackboard.com', {
		proxyReqOptDecorator: (proxyReqOpts, req) => {
			debug('rewriting authorization');
			proxyReqOpts.headers.authorization = `Bearer ${req.user.db.bb_access_token}`;
			delete proxyReqOpts.headers.origin;
			delete proxyReqOpts.headers.referer;
			return proxyReqOpts;
		},
		proxyReqPathResolver: req => {
			debug(req.path);
			const path = `/learn/api/public${req.path.replace('/core/v1/learn/', '')}`
			debug(path);
			return path;
		},
		userResDecorator: (proxyRes, proxyResData, req, res) => {
			if (!req.publishExam) return proxyResData;
			if (proxyRes.statusCode >= 400) return proxyResData;
			return new Promise((resolve, reject) => {
				const responseJSON = JSON.parse(proxyResData.toString());
				req.exam.contentId = responseJSON.contentId;
				req.exam.gradeColumnId = responseJSON.gradeColumnId;
				req.exam.save(err => {
					if (err) return reject(err);
					resolve(req.exam);
				});
			});
		}	
	})
);

module.exports = router;