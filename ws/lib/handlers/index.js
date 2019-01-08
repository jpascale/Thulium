const PostgresHandler = require('./psql')
		, MySQLHandler = require('./mysql')
		, debug = require('debug')('ws:handlers');

const handlersList = [
	PostgresHandler,
	MySQLHandler
];

debug('registering handlers')

const handlers = handlersList.reduce((memo, val) => {
	memo[val.TYPE] = {handler: val.handle, explain: val.explain};
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
	debug(`explain return ${handler.explain(message.payload,debug)}`);
	return handler.handler(ws, req, message.payload, done);
};

module.exports = {
	handle
};