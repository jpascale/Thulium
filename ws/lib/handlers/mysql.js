const { MySQLStorage } = require('@thulium/storage')
		, { Config } = require('@thulium/base')
		, debug = require('debug')('ws:handlers:mysql');

MySQLStorage.config(Config.storage.mysql);

const handle = (ws, req, message, done) => {
	debug(`querying mysql: ${message.query}`);
	MySQLStorage.query(message.query, (err, results, fields) => {
		if (err) return done(err);
		const response = {
			columns: fields.map(v => v.name),
			records: results,
			count: results.length
		}
		done(null, response);
	});
};

module.exports = {
	handle,
	TYPE: 'mysql'
};