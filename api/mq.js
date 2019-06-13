const { Config } = require('@thulium/base')
		, { jobs } = require('@thulium/jobs')
		, camelCase = require('lodash.camelcase')
		, zmq = require('zeromq')
		, sock = zmq.socket('push')
		, debug = require('debug')('api:mq');

sock.bindSync(`tcp://${Config.storage.mq.host}:${Config.storage.mq.port}`);
debug(`Producer bound to port ${Config.storage.mq.port}`);

const _send = sock.send;
sock.send = function () {
	const args = Array.prototype.slice.apply(arguments);
	args[0] = JSON.stringify(args[0]);
	return _send.apply(sock, args);
};

Object.values(jobs).forEach(key => { 
	sock[camelCase(key)] = function () {
		const args = Array.prototype.slice.apply(arguments);
		args[0] = { job: key, params: args[0] };
		return sock.send.apply(sock, args);
	}
});

module.exports = sock;
