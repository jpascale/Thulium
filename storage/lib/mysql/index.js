const mysql = require('mysql')
		, debug = require('debug')('storage:mysql');

const Module = {};

let pool;

Module.config = (config) => {
	if (pool) return;
	debug('configuring pool');
	pool = mysql.createPool(config);
};

Module.query = function () {
	if (!pool) {
		throw new Error('module has no config');
	}
	debug('querying postgres');
	return pool.query.apply(pool, arguments);
};

module.exports = Module;