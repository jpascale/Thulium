module.exports = [
	require('./create-dataset-instance'),
	require('./execute-query')
].reduce((memo, { key, job }) => {
	memo[key] = job;
	return memo;
}, {})