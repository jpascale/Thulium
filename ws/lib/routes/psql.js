const { PostgresStorage } = require('@thulium/storage')
	, { Config } = require('@thulium/base')
	, { DatasetInstance } = require('@thulium/internal')
	// , parser = require('pg-query-parser')
	, debug = require('debug')('ws:handlers:psql');

PostgresStorage.config(Config.storage.postgres);

const handler = (ws, req, message, session, done) => {
	// debug(`querying psql: ${message.query}`);

	// // TODO: It should come with the message
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

module.exports = handler;
