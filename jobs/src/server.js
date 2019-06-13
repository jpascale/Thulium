const { Config } = require('@thulium/base')
		, zmq = require('zeromq');

const sock = zmq.socket('pull')
		, pub = zmq.socket('pub');

sock.connect(`tcp://${Config.storage.mq.host}:${Config.storage.mq.port}`);
console.log(`Worker listening to port ${Config.storage.mq.port}`);

pub.bindSync(`tcp://${Config.storage.pubsub.host}:${Config.storage.pubsub.port}`);
console.log(`Publisher bound to port ${Config.storage.pubsub.port}`);

const jobs = require('./jobs');

sock.on('message', raw => {
	const rawMessage = raw.toString();
	const parsedMessage = (() => {
		try {
			return JSON.parse(rawMessage);
		} catch (e) {
			return null;
		}
	})();
	if (!parsedMessage.job) return;
	const job = jobs[parsedMessage.job];
	if (!job) return;
	job(parsedMessage.params, (err, announce) => {
		if (err) {
			return pub.send([`${parsedMessage.job}:error`, JSON.stringify(err)]);
		}
		pub.send([parsedMessage.job, JSON.stringify(announce)]);
	});
});
