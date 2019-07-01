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

const conditionReplacer = (tablesMap, whereExpression) => {
	if (whereExpression.lexpr.SubLink && whereExpression.rexpr.SubLink) {
		const l = recursivelyCheckAndReplaceAllTablesExist(tablesMap, whereExpression.lexpr.SubLink.subselect);
		const r = recursivelyCheckAndReplaceAllTablesExist(tablesMap, whereExpression.rexpr.SubLink.subselect);
		return l && r;
	}
	if (whereExpression.lexpr.SubLink) {
		const l = recursivelyCheckAndReplaceAllTablesExist(tablesMap, whereExpression.lexpr.SubLink.subselect);
		return l;
	}
	if (whereExpression.rexpr.SubLink) {
		const r = recursivelyCheckAndReplaceAllTablesExist(tablesMap, whereExpression.rexpr.SubLink.subselect);
		return r;
	}
	return true;
};

const recursivelyCheckAndReplaceWhereClause = (tablesMap, whereClause) => {
	if (whereClause.SubLink) {
		return recursivelyCheckAndReplaceAllTablesExist(tablesMap, whereClause.SubLink.subselect);
	}
	const whereExpressionKey = Object.keys(whereClause).filter(k => /Expr$/)[0];
	const whereExpression = whereClause[whereExpressionKey];
	if (whereExpression.lexpr) {
		return conditionReplacer(tablesMap, whereExpression);
	}
	if (whereExpression.args) {
		return every(whereExpression.args, e => recursivelyCheckAndReplaceWhereClause(tablesMap, e));
	}
	return true;
};

const recursivelyCheckAndReplaceAllTablesExist = (tablesMap, query) => {
	if (query.ExplainStmt) {
		return recursivelyCheckAndReplaceAllTablesExist(tablesMap, query.ExplainStmt.query);
	}
	const statementKey = Object.keys(query).filter(s => /Stmt$/)[0];
	const target = (() => {
		if (query[statementKey].relation) return [query[statementKey].relation];
		if (query[statementKey].query) return rec
		return query[statementKey].fromClause;
	})();
	const statementCondition = every(target, t => {
		if (t.RangeSubselect) return recursivelyCheckAndReplaceAllTablesExist(tablesMap, t.RangeSubselect.subquery);
		if (t.JoinExpr) {
			if (t.JoinExpr.larg.RangeSubselect && t.JoinExpr.rarg.RangeSubselect) {
				const l = recursivelyCheckAndReplaceAllTablesExist(tablesMap, t.JoinExpr.larg.RangeSubselect.subquery);
				const r = recursivelyCheckAndReplaceAllTablesExist(tablesMap, t.JoinExpr.rarg.RangeSubselect.subquery);
				return l && r;
			}
			if (t.JoinExpr.larg.RangeSubselect) {
				const l = recursivelyCheckAndReplaceAllTablesExist(tablesMap, t.JoinExpr.larg.RangeSubselect.subquery);
				const r = tablesMap.get(t.JoinExpr.rarg.RangeVar.relname);
				t.JoinExpr.rarg.RangeVar.relname = tablesMap.get(t.JoinExpr.rarg.RangeVar.relname);
				return l && r;
			}
			if (t.JoinExpr.rarg.RangeSubselect) {
				const r = recursivelyCheckAndReplaceAllTablesExist(tablesMap, t.JoinExpr.rarg.RangeSubselect.subquery);
				const l = tablesMap.get(t.JoinExpr.larg.RangeVar.relname);
				t.JoinExpr.larg.RangeVar.relname = tablesMap.get(t.JoinExpr.larg.RangeVar.relname);
				return l && r;
			}
			const l = tablesMap.get(t.JoinExpr.larg.RangeVar.relname);
			const r = tablesMap.get(t.JoinExpr.rarg.RangeVar.relname);
			t.JoinExpr.larg.RangeVar.relname = tablesMap.get(t.JoinExpr.larg.RangeVar.relname);
			t.JoinExpr.rarg.RangeVar.relname = tablesMap.get(t.JoinExpr.rarg.RangeVar.relname);
			return l && r;
		}
		if (!tablesMap.get(t.RangeVar.relname)) return false;
		t.RangeVar.relname = tablesMap.get(t.RangeVar.relname);
		return true;
	});
	if (!query[statementKey].whereClause) return statementCondition;
	const whereCondition = recursivelyCheckAndReplaceWhereClause(tablesMap, query[statementKey].whereClause);
	return statementCondition && whereCondition;
}

module.exports = (instance, parsedQueries) => {
	const { tables: tablesMap, dataset } = instance;
	const allTablesExist = every(parsedQueries, q => recursivelyCheckAndReplaceAllTablesExist(tablesMap, q));
	if (!allTablesExist) return 'Table name does not exist';
	debug(dataset.actions);
	const allowedToDoEverything = every(Array.from(dataset.actions.keys()), action => {
		if (dataset.actions[action]) return true;
		debug(`checking if %s is allowed`, action)
		return actionsRepo[action](parsedQueries);
	});
	if (!allowedToDoEverything) return 'Not allowed in this dataset'
};
