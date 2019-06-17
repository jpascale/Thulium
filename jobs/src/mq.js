const { Config } = require('@thulium/base')
		, camelCase = require('lodash.camelcase')
		, zmq = require('zeromq')
		, sock = zmq.socket('push')
		, req = zmq.socket('req')
		, debug = require('debug')('jobs:mq');

let sender;

module.exports = jobs => type => {
	if (sender) return sender;
	sender = (() => {
		if (type === 'push') {
			try {
				sock.bindSync(`tcp://${Config.storage.mq.host}:${Config.storage.mq.port}`);
				debug(`Push producer bound to port ${Config.storage.mq.port}`);
			} catch (err) {
				// do nothing
			}
			
			return sock;
		}
		if (type === 'req') {
			try {
				req.connect(`tcp://${Config.storage.reqres.host}:${Config.storage.reqres.port}`);
				debug(`Push producer bound to port ${Config.storage.reqres.port}`);
			} catch (err) {
				// do nothing
			}
			return req;
		}
	})();
	if (!sender) throw new Error('invalid sender type');
	const _send = sender.send;
	sender.send = function () {
		const args = Array.prototype.slice.apply(arguments);
		debug('sender.send %o', args);
		args[0] = JSON.stringify(args[0]);
		if (type === 'push') {
			return _send.apply(sender, args);
		}
		if (typeof(args[args.length - 1]) === 'function') {
			const callback = args[args.length - 1];
			sender.once('message', callback);
			_send.apply(sender, args.slice(0, args.length - 1));
		}
		return _send.apply(sender, args);
	};
	sender.KEYS = {};

	Object.values(jobs).forEach(key => { 
		sender[camelCase(key)] = function () {
			const args = Array.prototype.slice.apply(arguments);
			args[0] = { job: key, params: args[0] };
			return sender.send.apply(sender, args);
		};
		sender.KEYS[key.toUpperCase().replace(/\ /g, '_')] = key;
	});

	return sender;
};
