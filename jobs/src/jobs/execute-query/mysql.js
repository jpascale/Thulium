const { MySQLStorage } = require('@thulium/storage')
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

	const queries = parser.deparse(parsedQueries).replace(/"(table_[a-f0-9]{32})"/g, '$1');
	MySQLStorage.query(queries, cb);
};

Module.reportResults = ([ rows, columns ]) => ({
	columns: columns.map(v => v.name),
	records: rows,
	count: rows.length
});

module.exports = Module;
