const { MySQLStorage } = require('@thulium/storage')
		, debug = require('debug')('jobs:execute-query:psql')
		, parser = require('pg-query-parser');

const every = (coll, pred) => !coll.find((v, i) => !pred(v, i, coll));

const Module = {};

Module.executeQuery = ({ instance, content }, cb) => {
	const tablesMap = instance.tables;
	debug('running query using mapping %o', tablesMap);

	const parsedQueries = parser.parse(content).query;
	const allTablesExist = every(parsedQueries, q => {
		return every(q.SelectStmt.fromClause || [], t => {
			debug(t.RangeVar.relname);
			debug(tablesMap);
			debug(tablesMap.get(t.RangeVar.relname));
			if (!tablesMap.get(t.RangeVar.relname)) {
				return false;
			}
			t.RangeVar.relname = tablesMap.get(t.RangeVar.relname);
			return true;
		});
	});
	if (!allTablesExist) {
		return cb(`Table name does not exist`);
	}

	const queries = parser.deparse(parsedQueries).replace(/"(table_[a-f0-9]{32})"/g, '$1');

	debug(queries);

	MySQLStorage.query(queries, cb);
};

Module.reportResults = ([ rows, columns ]) => ({
	columns: columns.map(v => v.name),
	records: rows,
	count: rows.length
});

module.exports = Module;
