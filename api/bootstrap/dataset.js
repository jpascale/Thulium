const { Dataset } = require('@thulium/internal')
		, debug = require('debug')('api:bootstrap:dataset')
		, async = require('async')
		, { Config } = require('@thulium/base');

const findOrCreateDefaultDataset = ({ title, paradigm, items }, next) => {
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
				userId: '5be21d6404c4adde3273dcaa',
				default: true
			}, cb);
		}
	], next);
};

const boot = done => {
	debug('bootstraping dataset');
	findOrCreateDefaultDataset(Config.defaultDataset, done);
};

module.exports = {
	boot
};