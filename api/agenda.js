const Agenda = require('agenda')
	, debug = require('debug')('api:jobs')
	, { connection } = require('@thulium/internal');

const agenda = new Agenda();

const setup = cb => {
	agenda.mongo(connection).processEvery('30 seconds');

	agenda.on('fail', (err, job) => {
		debug(`[${job.attrs.name}] FAILED`);
		console.error(err);
	});

	agenda.on('error', (err) => {
		debug('agenda setup failed with error %o', err);
		console.error(err);
	});

	agenda.on('start', job => {
		debug(`Job ${job.attrs.name} starting`);
	});

	agenda.on('complete', job => {
		debug(`Job ${job.attrs.name} finished`);
	});

	agenda.start().then(() => {
		debug('agenda is ready');
		cb();
	}).catch(cb);
};

module.exports = agenda;
module.exports.setup = setup;