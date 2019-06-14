module.exports = {
	engines: next => require('./engines').boot(next),
	admin: next => require('./admin').boot(next),
	dataset: ['admin', ({ admin }, cb) => {
		require('./dataset').boot({ admin }, cb);
	}]
};