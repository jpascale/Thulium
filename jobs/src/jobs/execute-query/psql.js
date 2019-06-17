const { PostgresStorage } = require('@thulium/storage')
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

	const queries = parser.deparse(parsedQueries);

	PostgresStorage.query(queries, cb);
};

Module.reportResults = result => ({
	columns: result.fields.map(v => v.name),
	records: result.rows,
	count: result.rowCount
});

module.exports = Module;
