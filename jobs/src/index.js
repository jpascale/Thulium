const jobs = Object.keys(require('./jobs/')).reduce((memo, key) => {
	memo[key] = key;
	return memo;
}, {});
const mq = require('./mq')(jobs);

module.exports = {
	mq,
	jobs,
};