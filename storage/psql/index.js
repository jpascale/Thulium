const { Pool } = require('pg')
		, crypto =require('crypto')
		, async = require('async')
		, debug = require('debug')('storage:postgres')
		, escape = require('pg-escape')
		, parser = require('pg-query-parser')
		, generateTableName = require('../utils/generateTableName')
		, toSQLColumnName = require('../utils/toSQLColumnName')
		, chunk = require('../utils/chunk')
		, range = require('../utils/range');

const PSQL = {};

let pool;

PSQL.config = (config) => {
	if (pool) return;
	debug('configuring pool');
	pool = new Pool(config);
};

PSQL.parse = sql => parser.parse(sql);

PSQL.query = function () {
	if (!pool) {
		throw new Error('module has no config');
	}
	debug('trying parser');
	const { query: ast, error } = PSQL.parse();
	if (error) {
		const callback = Array.prototype.slice.call(arguments)[arguments.length - 1];
		if (typeof(callback) === 'function') {
			return callback(null, error);
		}
		return Promise.reject(error);
	}
	debug(ast);
	debug('querying postgres');
	return pool.query.apply(pool, arguments);
};

PSQL.createDataset = ({ headers, data }, done) => {
	if (!pool) {
		throw new Error('module has no config');
	}

	const tableName = generateTableName(new Buffer(data));
	const columnHeaders = headers.map(toSQLColumnName);

	async.series([
		next => {
			debug(`dropping ${tableName}`);
			PSQL.query(`DROP TABLE IF EXISTS ${tableName}`, next)
		},
		next => {
			const headersSQL = columnHeaders.map(h => `${h} TEXT`).join(',\n');
			const createTableSQL = `CREATE TABLE ${tableName} (
				${headersSQL}
			)`;
			debug('creating table with DDL');
			debug(createTableSQL);
			PSQL.query(createTableSQL, next);
		},
		next => {
			debug('inserting data');
			const chunkedData = chunk(data, 100);
			async.eachLimit(chunkedData, 100, (chunk, cb) => {
				const sqlValues = chunk.map((c, i) => `(${range(c.length, 1, j => '%L').join(', ')})`).join(', ');
				const insertDataSQL = `INSERT INTO ${tableName} (${columnHeaders.join(', ')}) VALUES ${sqlValues}`;
				const query = escape(insertDataSQL, ...flatten(data))
				debug('inserting data with query');
				debug(query);
				PSQL.query(query, cb);
			}, next);
		}
	], err => {
		if (err) return done(err);
		done(null, { tableName });
	});
};

module.exports = PSQL;