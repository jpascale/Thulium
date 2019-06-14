const { Dataset } = require('@thulium/internal')
		, debug = require('debug')('api:bootstrap:dataset')
		, async = require('async')
		, { Config } = require('@thulium/base');

const findOrCreateDefaultDataset = ({ title, paradigm, items }, { admin }, next) => {
	debug(`creating default dataset`);
	async.waterfall([
		cb => Dataset.collection.count({ default: true }, cb),
		(count, cb) => {
			if (count) {
				debug(`default dataset was already created`);
				return cb();
			}
			debug(`creating default dataset`);
			Dataset.create({
				title,
				paradigm,
				items,
				userId: admin._id,
				default: true
			}, cb);
		}
	], next);
};

const boot = ({ admin }, done) => {
	debug('bootstraping dataset');
	findOrCreateDefaultDataset(Config.defaultDataset, { admin }, done);
};

module.exports = {
	boot
};