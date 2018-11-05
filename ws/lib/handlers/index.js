const PostgresHandler = require('./psql')
		, debug = require('debug')('ws:handlers');

const handlersList = [
	PostgresHandler
];

debug('registering handlers')

const handlers = handlersList.reduce((memo, val) => {
	memo[val.TYPE] = val.handle;
	return memo;
}, {});

debug('registered handlers');
debug(handlers);

const handle = (ws, req, message, done) => {
	debug(`handling message of type ${message.type}`);
	const handler = handlers[message.type];
	if (!handler) {
		return done(new Error('No such handler'));
	}
	return handler(ws, req, message.payload, done);
}

module.exports = {
	handle
};