const { Config } = require('@thulium/base')
		, { Job } =require('@thulium/internal')
		, zmq = require('zeromq')
		, async = require('async')
		, debug = require('debug')('jobs:server');

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
	debug('received new message %o', parsedMessage);
	if (!parsedMessage.job) return;
	const jobHandler = jobs[parsedMessage.job];
	if (!jobHandler) return;
	debug('routing to job handler %s', parsedMessage.job);
	async.auto({
		job: cb => {
			debug('fetching job with id %s', parsedMessage.params);
			Job.findById(parsedMessage.params).exec(cb);
		},
		markReceived: ['job', ({ job }, cb) => {
			if (!job) {
				return cb('no such job');
			}
			debug('marking as received');
			job.status = 'received';
			job.save(cb);
		}],
		announce: ['job', ({ job }, cb) => {
			debug('running job with params %o', job.params);
			jobHandler(job.params, cb);
		}]
	}, (err, { announce, job }) => {
		if (err) {
			if (!job) return;
			console.error(err);
			job.status = 'failed';
			job.save(_err => {
				if (err) {
					console.error(_err);
				}
				pub.send([`${parsedMessage.job}:error`, JSON.stringify(err)]);
			})
			return;
		}
		job.status = 'completed';
		job.save(_err => {
			if (_err) {
				console.error(_err)
			}
			pub.send([parsedMessage.job, JSON.stringify(announce)]);
		});
	});
});
