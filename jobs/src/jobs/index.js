module.exports = [
	require('./create-dataset-instance')
].reduce((memo, { key, job }) => {
	memo[key] = job;
	return memo;
}, {})