const { User } = require('@thulium/internal')
		, debug = require('debug')('api:bootstrap:admin')
		, async = require('async')
		, { Config } = require('@thulium/base');

const findOrCreateAdmin = ({ email, password }, next) => {
	debug(`find or create admin`);
	async.waterfall([
		cb => User.collection.findOne({ email }, cb),
		(admin, cb) => {
			if (admin) {
				debug(`admin was already created`);
				return cb(null, admin, true);
			}
			debug(`creating admin`);
			User.create({ email, role: 'admin' }, (err, admin) => {
				cb(err, admin, false);
			});
		},
		(admin, skip, cb) => {
			if (skip) return cb(null, admin, true);
			debug('created admin');
			debug('changing password');
			admin.changePassword(password, err => {
				cb(err, admin, false);
			});
		},
		(admin, skip, cb) => {
			if (skip) return cb(null, admin);
			debug('saving');
			admin.save(cb);
		}
	], next);
};

const boot = done => {
	debug('bootstraping admin');
	findOrCreateAdmin(Config.admin, done);
};

module.exports = {
	boot
};