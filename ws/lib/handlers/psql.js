const { PostgresStorage } = require('@thulium/storage')
		, { Config } = require('@thulium/base')
		, debug = require('debug')('ws:handlers:psql')
		, async = require('async')
		, { Dataset } = require('@thulium/internal');

PostgresStorage.config(Config.storage.postgres);

const handle = (ws, req, message, done) => {
	async.waterfall([
		cb => Dataset.findById(message.dataset).exec(cb),
		(dataset, cb) => {
			if (!dataset) return cb('no such dataset');

			const [callable, sql] = (() => {
				if (message.query) return [PostgresStorage.query, message.query];
				return [PostgresStorage.explain, message.explain];
			})();

			const { query: ast, error } = PostgresStorage.parse(sql);
			
			dataset.forEach(dataset.forbidden, (policy, cb) => {
				// check in the AST whether it is allowed or not
			});

			debug(`querying psql: ${sql}`);

			callable(sql, cb);
		}
	], (err, result) => {
		if (err) return done(err);
		debug(result);
		const response = {
			columns: result.fields.map(v => v.name),
			records: result.rows,
			count: result.rowCount
		}
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
	TYPE: 'psql'
};