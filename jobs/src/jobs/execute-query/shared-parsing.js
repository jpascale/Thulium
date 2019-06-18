const debug = require('debug')('jobs:execute-query:shared')
		, every = require('../../util/every');

const actionsRepo = {
	can_create:
	can_drop:
	can_alter:
	can_truncate:
	can_comment:
	can_rename:
	can_insert:
	can_update:
	can_delete:
	can_grant:
	can_revoke:
	can_commit:
	can_rollback:
	can_savepoint:
	can_set_transaction:
};

module.exports = (instance, parsedQueries) => {
	const { tablesMap, dataset } = instance;
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
