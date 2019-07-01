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
	const start = Date.now();
	MySQLStorage.query(queries, (err, result) => {
		if (err) {
			err.displayMessage = err.message;
		} else {
			result.time = Date.now() - start;
		}
		cb(err, result);
	});
};

Module.reportResults = result => {
	const [rows, columns] = result;
	return {
		columns: columns.map(v => v.name),
		records: rows,
		count: rows.length,
		time: result.time
	};
};

module.exports = Module;
