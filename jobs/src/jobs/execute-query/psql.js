const { PostgresStorage } = require('@thulium/storage')
		, debug = require('debug')('jobs:execute-query:psql')
		, parser = require('pg-query-parser')
		, sharedParsing = require('./shared-parsing');

const Module = {};

Module.executeQuery = ({ instance, content }, cb) => {
	debug('running query using mapping %o', instance.tables);

	const parsedQueries = parser.parse(content).query;
	if (!sharedParsing(instance, parsedQueries)) {
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
