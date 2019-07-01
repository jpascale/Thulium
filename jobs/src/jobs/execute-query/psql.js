const { PostgresStorage } = require('@thulium/storage')
		, debug = require('debug')('jobs:execute-query:psql')
		, parser = require('pg-query-parser')
		, sharedParsing = require('./shared-parsing');

const Module = {};

Module.executeQuery = ({ instance, content }, cb) => {
	debug('running query using mapping %o', instance.tables);

	const { query: parsedQueries, error } = parser.parse(content);
	if (error) {
		error.displayMessage = error.message;
		return cb(error);
	}
	const sharedParsingError = sharedParsing(instance, parsedQueries);
	if (sharedParsingError) return cb(sharedParsingError);

	const queries = parser.deparse(parsedQueries);
	const start = Date.now();
	PostgresStorage.query(queries, (err, result) => {
		if (err) {
			err.displayMessage = err.message;
		}
		result.time = Date.now() - start;
		cb(err, result);
	});
};

Module.reportResults = result => ({
	columns: result.fields.map(v => v.name),
	records: result.rows,
	count: result.rowCount || 0,
	time: result.time
});

module.exports = Module;
