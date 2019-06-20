const debug = require('debug')('jobs:execute-query:shared')
		, every = require('../../util/every');

const actionsRepo = {
	can_create: qs => every(qs, q => !q.CreateStmt),
	can_drop: qs => every(qs, q => !q.DropStmt),
	can_alter: qs => every(qs, q => !q.AlterTableStmt),
	can_truncate: qs => every(qs, q => !q.TruncateStmt),
	can_rename: qs => every(qs, q => !q.RenameStmt),
	can_insert: qs => every(qs, q => !q.InsertStmt),
	can_update: qs => every(qs, q => !q.UpdateStmt),
	can_delete: qs => every(qs, q => !q.DeleteStmt),
	can_grant: qs => every(qs, q => !q.GrantStmt),
	can_revoke: qs => every(qs, q => !q.RevokeStmt),
	can_commit: qs => every(qs, q => !q.TransactionStmt),
	can_rollback: qs => every(qs, q => !q.TransactionStmt),
	can_savepoint: qs => every(qs, q => !q.TransactionStmt),
	can_set_transaction: qs => every(qs, q => !q.TransactionStmt),
};

module.exports = (instance, parsedQueries) => {
	const { tables: tablesMap, dataset } = instance;
	const allTablesExist = every(parsedQueries, q => {
		if (!q.SelectStmt) return true;
		return every(q.SelectStmt.fromClause || [], t => {
			debug('using %o to replace %s to %s', tablesMap, t.RangeVar.relname, tablesMap.get(t.RangeVar.relname));
			if (!tablesMap.get(t.RangeVar.relname)) {
				return false;
			}
			t.RangeVar.relname = tablesMap.get(t.RangeVar.relname);
			return true;
		});
	});
	if (!allTablesExist) return 'Table name does not exist';
	debug(dataset.actions);
	const allowedToDoEverything = every(Array.from(dataset.actions.keys()), action => {
		if (dataset.actions[action]) return true;
		debug(`checking if %s is allowed`, action)
		return actionsRepo[action](parsedQueries);
	});
	if (!allowedToDoEverything) return 'Not allowed in this dataset'
};
