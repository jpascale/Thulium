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
	debug(message.query.trim().substr(0,7).toUpperCase());
	let explainQuery;
	if(message.query.trim().substr(0,7).toUpperCase()==="EXPLAIN") {
		if (message.query.replace(/ +(?= )/g, '').trim().substr(0, 15).toUpperCase() === "EXPLAIN ANALYSE"){
			explainQuery = "EXPLAIN ".concat(message.query.replace(/ +(?= )/g, '').trim().substr(15));
	  }else{
			done(null, 0.0);
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
		let ans = parseFloat(response.records[0]['QUERY PLAN'].match(/\d+(\.\d+)?/g)[1]);
		done(null, ans);
		// TODO separate explain execution and parse result in different functions
	});
};

module.exports = {
	handle,
	explain,
	TYPE: 'psql'
};