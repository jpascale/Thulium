module.exports = [
	require('./createDatasetInstance')
].reduce((memo, { key, job }) => {
	memo[key] = job;
	return memo;
}, {})