const { MySQLStorage } = require('@thulium/storage')
		, debug = require('debug')('jobs:execute-query:mysql')
		, parser = require('pg-query-parser')
		, sharedParsing = require('./shared-parsing');

const Module = {};

Module.executeQuery = ({ instance, content, dataset }, cb) => {
	debug('running query using mapping %o', instance.tables);

	const { query: parsedQueries, error } = parser.parse(content);
	if (error) {
		error.displayMessage = error.message;
		return cb(error);
	}
	const sharedParsingError = sharedParsing(instance, parsedQueries);
	if (sharedParsingError) return cb(sharedParsingError);

	const queries = parser.deparse(parsedQueries).replace(/"(table_[a-f0-9]{32})"/g, '$1');
	MySQLStorage.query(queries, (err, result) => {
		if (err) {
			err.displayMessage = err.message;
		}
		cb(err, result);
	});
};

Module.reportResults = ([ rows, columns ]) => ({
	columns: columns.map(v => v.name),
	records: rows,
	count: rows.length
});

module.exports = Module;
