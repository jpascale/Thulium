const { PostgresStorage } = require('@thulium/storage')
		, debug = require('debug')('jobs:execute-query:psql')
		, parser = require('pg-query-parser')
		, sharedParsing = require('./shared-parsing');

const Module = {};

Module.executeQuery = ({ instance, content }, cb) => {
	const tablesMap = instance.tables;
	debug('running query using mapping %o', tablesMap);

	const parsedQueries = parser.parse(content).query;
	if (!sharedParsing(tablesMap, parsedQueries)) {
		return cb(`Table name does not exist`);
	}

	const queries = parser.deparse(parsedQueries);
	PostgresStorage.query(queries, cb);
};

Module.reportResults = result => ({
	columns: result.fields.map(v => v.name),
	records: result.rows,
	count: result.rowCount || 0
});

module.exports = Module;
