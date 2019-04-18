const { connect, User } = require("@thulium/internal")
		, { Config } = require('@thulium/base')
		, debug = require('debug')('jobs')
		, async = require('async')
		, superagent = require('superagent')
		, Agenda = require('agenda');

const agenda = new Agenda();

connect((err, connection) => {
	if (err) {
		console.error(err);
		debug('failed to connect to internal storage');
		process.exit(1);
	}

	agenda.mongo(connection).processEvery('30 seconds');

	agenda.on('ready', () => {
		debug('agenda is ready');
		agenda.now('refresh blackboard tokens');
	});

	agenda.on('fail', (err, job) => {
		debug(`[${job.attrs.name}] FAILED`);
		console.error(err);
	});

	agenda.on('start', job => {
		debug(`Job ${job.attrs.name} starting`);
	});

	agenda.on('complete', job => {
		debug(`Job ${job.attrs.name} finished`);
	});

	agenda.on('error', (err) => {
		debug('agenda setup failed with error %o', err);
		console.error(err);
	});

	agenda.start();
});