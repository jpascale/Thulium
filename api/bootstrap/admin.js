const { User } = require('@thulium/internal')
		, debug = require('debug')('api:bootstrap:admin')
		, async = require('async')
		, { Config } = require('@thulium/base');

const findOrCreateAdmin = ({ email }, next) => {
	debug(`creating admin`);
	async.waterfall([
		cb => User.collection.findOne({ email }, cb),
		(admin, cb) => {
			if (admin) {
				debug(`admin was already created`);
				return cb(null, admin);
			}
			debug(`creating admin`);
			User.create({ email, role: 'admin' }, cb);
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