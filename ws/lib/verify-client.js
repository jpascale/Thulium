const debug = require('debug')('ws:verify-client')
		, Status = require('http-status-codes')
		, async = require('async')
		, { Env, Util } = require('@thulium/base')
		, { User, Session, Job, File } = require('@thulium/internal')
		, { mq: _mq } = require('@thulium/jobs');

const mq = _mq('push');

const verifyClient = ({ origin, req, secure }, done) => {

	/// TODO: enforce secure wss in production

	const envOrigin = Env.select({
		development: 'http://localhost:3010',
		production: 'https://thulium.xyz'
	});

	if (process.env.NODE_ENV === 'production') {
		if (envOrigin !== origin) {
			debug('bad origin');
			return done(false, Status.BAD_REQUEST, Status.getStatusText(Status.BAD_REQUEST), {
				'X-Reason': 'Bad Origin'
			});
		}
	}

	const { headers, url } = req;
	const parsedURL = new URL(`http://localhost${url}`);
	const token = (() => {
		if (headers && headers.authorization) {
			const [scheme, credentials] = headers.authorization.split(' ');
			if (/^Bearer$/i.test(scheme)) {
				return credentials;
			}
		}
		
		const queryToken = parsedURL.searchParams.get('token');
		if (queryToken) return queryToken;
		return null;
	})();

	if (!token) {
		debug('invalid token');
		return done(false, Status.UNAUTHORIZED, Status.getStatusText(Status.UNAUTHORIZED), {
			'X-Reason': 'Malformed Token'
		});
	}

	async.auto({
		token: cb => Util.verifyToken(token, cb),
		user: ['token', ({ token }, cb) => {
			User.findById(token.sub, cb);
		}],
		session: ['token', ({ token }, cb) => {
			debug('ws session');
			Session.findOrCreateByOwner(token.sub, cb);
		}],
	}, (err, { token, user, session }) => {
		if (err) {
			console.error(err);
			return done(false, Status.UNAUTHORIZED, Status.getStatusText(Status.UNAUTHORIZED), {
				'X-Reason': 'Invalid Credentials'
			});
		}

		if (!user || !session) {
			debug('no such user or session');
			return done(false, Status.NOT_FOUND, Status.getStatusText(Status.NOT_FOUND), {
				'X-Reason': 'No Such User or Session'
			});
		}

		if (!session.old) {
			File.find({ _id: { $in: session.files } }).exec((err, files) => {
				if (err) {
					console.error(err);
					return;
				}
				const jobs = files.map(f => ({
					key: mq.KEYS.CREATE_DATASET_INSTANCE,
					params: {
						dataset: f.dataset,
						engine: f.engine,
						owner: user._id,
					},
					scope: []
				}));
	
				Job.insertMany(jobs, (err, jobs) => {
					if (err) return cb(err);
					jobs.forEach(job => {
						mq.createDatasetInstance(job._id);
					});
				});
			});
		}


		debug('accept connection');
		req.token = token;
		req.user = user;
		req.session = session;
		return done(true);
	});
};

module.exports = verifyClient;