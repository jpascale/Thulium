const { Engine } = require('@thulium/internal')
		, debug = require('debug')('api:bootstrap:engines')
		, async = require('async')
		, { Config } = require('@thulium/base');

const findOrCreateEngine = ({ id, title, enabled }, next) => {
	debug(`initializing ${title}`);
	async.waterfall([
		cb => Engine.collection.findOne({ _id: id }, cb),
		(dbEngine, cb) => {
			if (dbEngine) {
				debug(`${title} was already created`);
				return cb();
			}
			debug(`creating ${title}`);
			Engine.collection.insertOne({
				_id: id,
				title,
				enabled,
				created: new Date(),
				last_updated: new Date(),
			}, cb);
		}
	], next);
};

const boot = (done) => {
	debug('bootstraping engines');
	async.each(Config.engines, findOrCreateEngine, done);
};

module.exports = {
	boot
};