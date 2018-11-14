const { Engine } = require('@thulium/internal')
		, debug = require('debug')('api:bootstrap:engines')
		, async = require('async')
		, { Config } = require('@thulium/base');

const boot = (done) => {
	debug('bootstraping engines');
	async.each(Config.engines, (engine, next) => {
		debug(`initializing ${engine.title}`);
		async.waterfall([
			cb => Engine.collection.findOne({ slug: engine.slug }, cb),
			(dbEngine, cb) => {
				if (dbEngine) {
					debug(`${engine.title} was already created`);
					return cb();
				}
				debug(`creating ${engine.title}`);
				Engine.collection.insertOne(Object.assign({}, engine, {
					created: new Date(),
					last_updated: new Date(),
				}), cb);
			}
		], next);
	}, done);
};

module.exports = {
	boot
};