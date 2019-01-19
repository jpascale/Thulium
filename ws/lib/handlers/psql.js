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

const EXPLAIN = 'EXPLAIN';
const EXPLAIN_ANALYSE = 'EXPLAIN ANALYSE';

const explain = (message, done) => {
	const trimmedQuery = message.query.replace(/ +(?= )/g, '').trim();
	const explainQuery = (() => {
		if (trimmedQuery.substr(0, EXPLAIN_ANALYSE.length).toUpperCase() === EXPLAIN_ANALYSE) {
			return trimmedQuery;
		}
		if (trimmedQuery.substr(0, EXPLAIN.length).toUpperCase() === EXPLAIN) {
			return trimmedQuery;
		}
		return `${EXPLAIN} ${message.query}`;
	})();
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
	explain(message, (err, response) => {
		if (err) return done(err);
		const ans = parseFloat(response.records[0]['QUERY PLAN'].match(/\d+(\.\d+)?/g)[1]);
		done(null, ans);
	});
};
module.exports = {
	handle,
	explain,
	explainValue,
	TYPE: 'psql'
};