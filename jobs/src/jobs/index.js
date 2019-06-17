module.exports = [
	require('./create-dataset-instance'),
	require('./execute-query'),
	require('./compare-with-reduced')
].reduce((memo, { key, job }) => {
	memo[key] = job;
	return memo;
}, {})