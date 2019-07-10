const debug = require('debug')('jobs:execute-query:shared')
	, every = require('../../util/every')
	, { DatasetInstance } = require('@thulium/internal')
	, crypto = require('crypto');

const range = (n, b = 0, f = v => v) => Array.from({ length: n }).map((_, i) => f(b + i));
const generateRandomString = () => range(20, 0, () => Math.random().toString(36).substring(2, 15)).join('');

const generateRandomTableName = () => {
	debug('generating random table name');
	const hash = crypto.createHash('md5').update(generateRandomString()).digest();
	return `table_${hash.toString('hex')}`;
};

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

const conditionReplacer = (instance, whereExpression) => {
	if (whereExpression.lexpr.SubLink && whereExpression.rexpr.SubLink) {
		const l = recursivelyCheckAndReplaceAllTablesExist(instance, whereExpression.lexpr.SubLink.subselect);
		const r = recursivelyCheckAndReplaceAllTablesExist(instance, whereExpression.rexpr.SubLink.subselect);
		return l && r;
	}
	if (whereExpression.lexpr.SubLink) {
		const l = recursivelyCheckAndReplaceAllTablesExist(instance, whereExpression.lexpr.SubLink.subselect);
		return l;
	}
	if (whereExpression.rexpr.SubLink) {
		const r = recursivelyCheckAndReplaceAllTablesExist(instance, whereExpression.rexpr.SubLink.subselect);
		return r;
	}
	return true;
};

const recursivelyCheckAndReplaceWhereClause = (instance, whereClause) => {
	if (whereClause.SubLink) {
		return recursivelyCheckAndReplaceAllTablesExist(instance, whereClause.SubLink.subselect);
	}
	const whereExpressionKey = Object.keys(whereClause).filter(k => /Expr$/)[0];
	const whereExpression = whereClause[whereExpressionKey];
	if (whereExpression.lexpr) {
		return conditionReplacer(instance, whereExpression);
	}
	if (whereExpression.args) {
		return every(whereExpression.args, e => recursivelyCheckAndReplaceWhereClause(instance, e));
	}
	return true;
};

const recursivelyCheckAndReplaceExpression = instance => t => {
	if (t.RangeSubselect) return recursivelyCheckAndReplaceAllTablesExist(instance, t.RangeSubselect.subquery);
	if (t.JoinExpr) {
		if (t.JoinExpr.larg.RangeSubselect && t.JoinExpr.rarg.RangeSubselect) {
			const l = recursivelyCheckAndReplaceAllTablesExist(instance, t.JoinExpr.larg.RangeSubselect.subquery);
			const r = recursivelyCheckAndReplaceAllTablesExist(instance, t.JoinExpr.rarg.RangeSubselect.subquery);
			return l && r;
		}
		if (t.JoinExpr.larg.RangeSubselect) {
			const l = recursivelyCheckAndReplaceAllTablesExist(instance, t.JoinExpr.larg.RangeSubselect.subquery);
			const r = instance.tables.get(t.JoinExpr.rarg.RangeVar.relname);
			t.JoinExpr.rarg.RangeVar.relname = instance.tables.get(t.JoinExpr.rarg.RangeVar.relname);
			return l && r;
		}
		if (t.JoinExpr.rarg.RangeSubselect) {
			const r = recursivelyCheckAndReplaceAllTablesExist(instance, t.JoinExpr.rarg.RangeSubselect.subquery);
			const l = instance.tables.get(t.JoinExpr.larg.RangeVar.relname);
			t.JoinExpr.larg.RangeVar.relname = instance.tables.get(t.JoinExpr.larg.RangeVar.relname);
			return l && r;
		}
		debug(t);
		if (t.JoinExpr.larg.JoinExpr) {
			// debug('replace %s for %s', t.JoinExpr.rarg.RangeVar.relname, instance.tables.get(t.JoinExpr.rarg.RangeVar.relname));
			const r = instance.tables.get(t.JoinExpr.rarg.RangeVar.relname);
			t.JoinExpr.rarg.RangeVar.relname = instance.tables.get(t.JoinExpr.rarg.RangeVar.relname);
			const l = recursivelyCheckAndReplaceExpression(instance)(t.JoinExpr.larg);
			
			return l && r;
		}
		const l = instance.tables.get(t.JoinExpr.larg.RangeVar.relname);
		const r = instance.tables.get(t.JoinExpr.rarg.RangeVar.relname);
		t.JoinExpr.larg.RangeVar.relname = instance.tables.get(t.JoinExpr.larg.RangeVar.relname);
		t.JoinExpr.rarg.RangeVar.relname = instance.tables.get(t.JoinExpr.rarg.RangeVar.relname);
		return l && r;
	}
	if (!instance.tables.get(t.RangeVar.relname)) return false;
	t.RangeVar.relname = instance.tables.get(t.RangeVar.relname);
	return true;
}

const recursivelyCheckAndReplaceAllTablesExist = (instance, query) => {
	if (query.ExplainStmt) {
		return recursivelyCheckAndReplaceAllTablesExist(instance, query.ExplainStmt.query);
	}
	// Patch to create a new table and add it to the translation dict.
	if (query.CreateStmt) {
		const generatedTableName = generateRandomTableName();
		const currentName = query.CreateStmt.relation.RangeVar.relname;
		instance.tables.set(currentName, generatedTableName);

		DatasetInstance.collection.updateOne({
			_id: instance._id
		}, {
			$set: {
				[`tables.${currentName}`]: generatedTableName
			}
		}, err => {
			if (err) {
				console.error(err);
			}
		});

		// IMPORTANTE: no se esta editando la query actual: query.CreateStmt.relation.RangeVar.relname = newTableName;
	}
	const statementKey = Object.keys(query).filter(s => /Stmt$/)[0];
	const target = (() => {
		if (query[statementKey].relation) return [query[statementKey].relation];
		return query[statementKey].fromClause;
	})();
	const statementCondition = every(target, recursivelyCheckAndReplaceExpression(instance));
	if (!query[statementKey].whereClause) return statementCondition;
	const whereCondition = recursivelyCheckAndReplaceWhereClause(instance, query[statementKey].whereClause);
	return statementCondition && whereCondition;
}

module.exports = (instance, parsedQueries) => {
	const allTablesExist = every(parsedQueries, q => recursivelyCheckAndReplaceAllTablesExist(instance, q));
	if (!allTablesExist) return 'Table name does not exist';
	const allowedToDoEverything = every(Array.from(instance.dataset.actions.keys()), action => {
		if (instance.dataset.actions.get(action)) return true;
		debug(`checking if %s is allowed`, action)
		return actionsRepo[action](parsedQueries);
	});
	if (!allowedToDoEverything) return 'Not allowed in this dataset';
};
