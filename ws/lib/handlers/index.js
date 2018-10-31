const PostgresHandler = require('./psql');

const handlersList = [
	PostgresHandler
];

const handlers = handlersList.reduce((memo, val) => {
	memo[val.TYPE] = val.handle;
	return memo;
}, {});

const handle = (ws, req, message, done) => {
	const handler = handlers[message.type];
	if (!handler) {
		return done(new Error('No such handler'));
	}
	return handle(ws, req, message.payload, done);
}

module.exports = {
	handle
};