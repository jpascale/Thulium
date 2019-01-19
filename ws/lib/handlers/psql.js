const { PostgresStorage } = require('@thulium/storage')
		, { Config } = require('@thulium/base')
		, debug = require('debug')('ws:handlers:psql');

PostgresStorage.config(Config.storage.postgres);

const handle = (ws, req, message, done) => {
	debug(`querying psql: ${message.query}`);
	PostgresStorage.query(message.query, (err, result) => {
		if (err) return done(err);
		const response = {
			columns: result.fields.map(v => v.name),
			records: result.rows,
			count: result.rowCount
		}
		done(null, response);
	});
};

const explain = (message, done) => {
	let beginningStr = message.query.trim().substr(0,Math.min(7,message.query.length)).toUpperCase();
	debug(beginningStr);
	let explainQuery;
	if(beginningStr ==="EXPLAIN") {
		beginningStr = message.query.replace(/ +(?= )/g, '').trim().substr(0, Math.min(15,message.query.length)).toUpperCase();
		if (beginningStr === "EXPLAIN ANALYSE"){
			explainQuery = "EXPLAIN ".concat(message.query.replace(/ +(?= )/g, '').trim().substr(15));
	  }else{
			let ans = { columns: [ 'QUERY PLAN' ],
				records:
					[ { 'QUERY PLAN': 'Result  (cost=0.00..0.00 rows=1 width=0)' } ],
				count: null
			};
			done(null, ans);
	  }
	}else {
		explainQuery = "EXPLAIN ".concat(message.query);
	}
	debug(`querying explain psql: ${explainQuery}`);
	PostgresStorage.query(explainQuery, (err, result) => {
		if (err) return done(err);
		const response = {
			columns: result.fields.map(v => v.name),
			records: result.rows,
			count: result.rowCount
		};
		done(null, response);
	});
};

const explainValue = (message, done) => {
	explain(message,(err, response) =>
	{
		if (err) return done(err);
		let ans = parseFloat(response.records[0]['QUERY PLAN'].match(/\d+(\.\d+)?/g)[1])
		done(null, ans);
	});
};
module.exports = {
	handle,
	explain,
	explainValue,
	TYPE: 'psql'
};