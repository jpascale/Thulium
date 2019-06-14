const { Dataset, File, DatasetInstance } = require('@thulium/internal')
		, { PostgresStorage } = require('@thulium/storage')
		, { Config } = require('@thulium/base')
		, EXECUTE_QUERY = 'execute query'
		, debug = require('debug')('jobs:execute-query')
		, async = require('async')
		, parser = require('pg-query-parser');

PostgresStorage.config(Config.storage.postgres);

const every = (coll, pred) => !coll.find((v, i) => !pred(v, i, coll));

const job = ({ file, content }, done) => {

	async.auto({
		file: cb => File.findById(file).exec(cb),
		instance: ['file', ({ file }, cb) => {
			debug('finding dataset instance')
			DatasetInstance.findOne({
				dataset: file.dataset,
				owner: file.owner,
				engine: file.engine,
				exam: file.exam
			}, cb);
		}],
		result: ['instance', 'file', ({ instance }, cb) => {
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
		}]
	}, (err, { result }) => {
		if (err) return done(err);
		debug(result);
		done(null, {
			columns: result.fields.map(v => v.name),
			records: result.rows,
			count: result.rowCount
		});
	});

	// TODO: It should come with the message
	// const hardcodedDatasetInstanceId = '5cc4a0f70da37fc68ff14d11';

	// DatasetInstance.findOne({ _id: hardcodedDatasetInstanceId }, (err, res) => {
	// 	if (err) return done(err);
	// 	const tablesMap = res.tables;
	// 	let success = true;

	// 	const parsedQueries = parser.parse(message.query).query;
	// 	parsedQueries.forEach(q => {
	// 		q.SelectStmt.fromClause.forEach(t => {
	// 			console.log(t.RangeVar.relname);
	// 			console.log(tablesMap);
	// 			console.log(tablesMap.get(t.RangeVar.relname));
	// 			if (!tablesMap.get(t.RangeVar.relname)) {
	// 				success = false;
	// 			}
	// 			t.RangeVar.relname = tablesMap.get(t.RangeVar.relname);
	// 		})
	// 	});
	// 	if (!success) {
	// 		return done(`Table name does not exist`);
	// 	}
	// 	const queries = parser.deparse(parsedQueries);

	// 	PostgresStorage.query(queries, (err, result) => {
	// 		if (err) return done(err);
	// 		const response = {
	// 			columns: result.fields.map(v => v.name),
	// 			records: result.rows,
	// 			count: result.rowCount
	// 		}
	// 		ws.send(JSON.stringify(response), done);
	// 	});
	// });
};

module.exports = {
	key: EXECUTE_QUERY,
	job
};
