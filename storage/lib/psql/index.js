const { Pool } = require('pg')
	, crypto = require('crypto')
	, async = require('async')
	, debug = require('debug')('storage:postgres')
	, escape = require('pg-escape');

const Module = {};

let pool;

Module.config = (config) => {
	if (pool) return;
	debug('configuring pool');
	pool = new Pool(config);
};

const ENGINE_ID = 'psql';

Module.getDatabaseId = () => ENGINE_ID;

Module.query = function () {
	if (!pool) {
		throw new Error('module has no config');
	}
	debug('querying postgres');
	return pool.query.apply(pool, arguments);
};

const generateTableName = (data) => 'table_' + crypto.createHash('md5').update(data).digest('hex');
const toSQLColumnName = c => c.replace(/[^0-9a-zA-Z_]/g, '').replace(/^[^a-zA-Z_]+/, '');

const chunk = (arr, chunkSize, cache = []) => {
	const tmp = [...arr];
	while (tmp.length) cache.push(tmp.splice(0, chunkSize));
	return cache;
};

const range = (n, b = 0, fn = i => i) => new Array(n).fill(undefined).map((_, i) => fn(b + i));
const flatten = arr => arr.reduce((memo, arr) => memo.concat(arr), []);

const dataTypeMap = {
	Int: 'INTEGER',
	String: 'VARCHAR(255)',
	Float: 'NUMERIC'
};

const zipObject = (headers, values) => headers.reduce((memo, h, i) => {
	memo[h] = values[i];
	return memo;
}, {});

// Deprecated
Module.createTable = ({ headers, data, types }, done) => {
	if (!pool) {
		throw new Error('module has no config');
	}

	const tableName = generateTableName(new Buffer(data));
	const columnHeaders = headers.map(toSQLColumnName);

	async.series([
		next => {
			debug(`dropping ${tableName}`);
			Module.query(`DROP TABLE IF EXISTS ${tableName}`, next)
		},
		next => {
			const headersSQL = columnHeaders.map((h, i) => (
				`${h} ${dataTypeMap[types[i]]}`
			)).join(',\n');
			const createTableSQL = `CREATE TABLE ${tableName} (
				${headersSQL}
			)`;
			debug('creating table with DDL');
			debug(createTableSQL);
			Module.query(createTableSQL, next);
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
				Module.query(query, cb);
			}, next);
		}
	], err => {
		if (err) return done(err);
		done(null, { tableName });
	});
};

Module.createDataset = ({ items, }, done) => {
	debug('creating dataset in psql');
	async.map(items, (item, cb) => {
		debug(`creating table ${item.title}`);
		Module.createTable(item, cb);
	}, (err, results) => {
		if (err) return done(err);
		debug('created all tables');
		done(null, {
			engine: ENGINE_ID,
			tables: items.reduce((memo, val, i) => {
				memo[val.title] = results[i].tableName;
				return memo;
			}, {})
		})
	});
};

module.exports = Module;