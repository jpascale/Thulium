const debug = require('debug')('jobs:execute-query:shared');

const every = (coll, pred) => !coll.find((v, i) => !pred(v, i, coll));

module.exports = (tablesMap, parsedQueries) => {
	const allTablesExist = every(parsedQueries, q => {
		return every(q.SelectStmt.fromClause || [], t => {
			debug('using %o to replace %s to %s', tablesMap, t.RangeVar.relname, tablesMap.get(t.RangeVar.relname));
			if (!tablesMap.get(t.RangeVar.relname)) {
				return false;
			}
			t.RangeVar.relname = tablesMap.get(t.RangeVar.relname);
			return true;
		});
	});
	return allTablesExist ? parsedQueries : null;
};
