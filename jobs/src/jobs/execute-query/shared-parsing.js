const debug = require('debug')('jobs:execute-query:shared')
	, every = require('../../util/every')
	, { DatasetInstance } = require('@thulium/internal');

const generateRandomString = () => {
	let str = '';
	for (let i = 0; i < 20; i++) {
		str += Math.random().toString(36).substring(2, 15);
	}
	return str;
}
// This is a patch and should be moved/fixed
const generateRandomTableName = () => {
	debug('generating random table name');
	const dataHash = crypto.createHash('md5').update(new Buffer(generateRandomString())).digest();
	const titleHash = crypto.createHash('md5').update(generateRandomString()).digest();
	const shuffle = (() => {
		return crypto.createHash('md5').update(generateRandomString()).digest();
	})();
	const hash = Buffer.allocUnsafe(dataHash.length);
	for (let i = 0; i < hash.length; i++) {
		hash[i] = dataHash[i] ^ shuffle[i] ^ titleHash[i];
	}
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

const recursivelyCheckAndReplaceAllTablesExist = (instance, query) => {
	if (query.ExplainStmt) {
		return recursivelyCheckAndReplaceAllTablesExist(instance, query.ExplainStmt.query);
	}
	// Patch to create a new table and add it to the translation dict.
	if (query.CreateStmt) {
		const newTableName = generateRandomTableName();
		const currentName = CreateStmt.relation.RangeVar.relname;
		instance.tablesMap[currentName] = newTableName;

		DatasetInstance.collection.updateOne({
			_id: instance._id
		}, {
				[`tables.${currentName}`]: newTableName
			}, () => { });

		// IMPORTANTE: no se esta editando la query actual: query.CreateStmt.relation.RangeVar.relname = newTableName;
	}
	const statementKey = Object.keys(query).filter(s => /Stmt$/)[0];
	const target = (() => {
		if (query[statementKey].relation) return [query[statementKey].relation];
		if (query[statementKey].query) return rec
		return query[statementKey].fromClause;
	})();
	const statementCondition = every(target, t => {
		if (t.RangeSubselect) return recursivelyCheckAndReplaceAllTablesExist(instance, t.RangeSubselect.subquery);
		if (t.JoinExpr) {
			if (t.JoinExpr.larg.RangeSubselect && t.JoinExpr.rarg.RangeSubselect) {
				const l = recursivelyCheckAndReplaceAllTablesExist(instance, t.JoinExpr.larg.RangeSubselect.subquery);
				const r = recursivelyCheckAndReplaceAllTablesExist(instance, t.JoinExpr.rarg.RangeSubselect.subquery);
				return l && r;
			}
			if (t.JoinExpr.larg.RangeSubselect) {
				const l = recursivelyCheckAndReplaceAllTablesExist(instance, t.JoinExpr.larg.RangeSubselect.subquery);
				const r = instance.tablesMap.get(t.JoinExpr.rarg.RangeVar.relname);
				t.JoinExpr.rarg.RangeVar.relname = instance.tablesMap.get(t.JoinExpr.rarg.RangeVar.relname);
				return l && r;
			}
			if (t.JoinExpr.rarg.RangeSubselect) {
				const r = recursivelyCheckAndReplaceAllTablesExist(instance, t.JoinExpr.rarg.RangeSubselect.subquery);
				const l = instance.tablesMap.get(t.JoinExpr.larg.RangeVar.relname);
				t.JoinExpr.larg.RangeVar.relname = instance.tablesMap.get(t.JoinExpr.larg.RangeVar.relname);
				return l && r;
			}
			const l = instance.tablesMap.get(t.JoinExpr.larg.RangeVar.relname);
			const r = instance.tablesMap.get(t.JoinExpr.rarg.RangeVar.relname);
			t.JoinExpr.larg.RangeVar.relname = instance.tablesMap.get(t.JoinExpr.larg.RangeVar.relname);
			t.JoinExpr.rarg.RangeVar.relname = instance.tablesMap.get(t.JoinExpr.rarg.RangeVar.relname);
			return l && r;
		}
		if (!instance.tablesMap.get(t.RangeVar.relname)) return false;
		t.RangeVar.relname = instance.tablesMap.get(t.RangeVar.relname);
		return true;
	});
	if (!query[statementKey].whereClause) return statementCondition;
	const whereCondition = recursivelyCheckAndReplaceWhereClause(instance, query[statementKey].whereClause);
	return statementCondition && whereCondition;
}

module.exports = (instance, parsedQueries) => {
	const { tables: tablesMap, dataset } = instance;
	const allTablesExist = every(parsedQueries, q => recursivelyCheckAndReplaceAllTablesExist(instance, q));
	if (!allTablesExist) return 'Table name does not exist';
	debug(dataset.actions);
	const allowedToDoEverything = every(Array.from(dataset.actions.keys()), action => {
		if (dataset.actions[action]) return true;
		debug(`checking if %s is allowed`, action)
		return actionsRepo[action](parsedQueries);
	});
	if (!allowedToDoEverything) return 'Not allowed in this dataset'
};
