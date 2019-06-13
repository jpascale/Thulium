const jobs = require('./jobs/');
module.exports = {
	jobs: Object.keys(jobs).reduce((memo, key) => {
		memo[key] = key;
		return memo;
	})
};