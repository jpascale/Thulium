const { File, DatasetInstance } = require('@thulium/internal')
		, EXECUTE_QUERY = 'execute query'
		, debug = require('debug')('jobs:execute-query')
		, async = require('async');

const executors = {
	psql: require('./psql'),
	mysql: require('./mysql')
};

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
		result: ['instance', 'file', ({ instance, file }, cb) => {
			const executor = executors[file.engine];
			executor.executeQuery({ instance, content }, cb);
		}]
	}, (err, { result, file }) => {
		if (err) return done(err);
		debug(result);
		const executor = executors[file.engine];
		done(null, executor.reportResults(result));
	});
};

module.exports = {
	key: EXECUTE_QUERY,
	job
};
