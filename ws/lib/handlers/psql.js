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

module.exports = {
	handle,
	TYPE: 'psql'
};