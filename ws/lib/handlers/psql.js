const { PostgresStorage } = require('@thulium/storage')
		, { Config } = require('@thulium/base')
		, debug = require('debug')('ws:handlers:psql');

PostgresStorage.config(Config.storage.postgres);

const handle = (ws, req, message, done) => {
	debug(`querying psql: ${message.query}`);
	PostgresStorage.query(message.query, done);
};

module.exports = {
	handle,
	TYPE: 'psql'
};