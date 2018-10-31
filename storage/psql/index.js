const { Pool } = require('pg')
		, debug = require('debug')('storage:postgres');

const Module = {};

let pool;

Module.config = (config) => {
	if (pool) return;
	debug('configuring pool');
	pool = new Pool(config);
};

Module.query = function () {
	if (!pool) {
		throw new Error('module has no config');
	}
	debug('querying postgres');
	return pool.query.apply(pool, arguments);
};

module.exports = Module;