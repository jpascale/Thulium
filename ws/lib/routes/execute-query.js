const { Job } = require('@thulium/internal')
		, debug = require('debug')('ws:handlers:psql')
		, { mq } = require('@thulium/jobs');

const handler = (ws, req, message, done) => {
	debug(`executing query via mq`);

	Job.create({
		key: mq.KEYS.EXECUTE_QUERY,
		params: {
			file: message.file,
			content: message.content
		},
		scope: [ws.id]
	}, (err, job) => {
		if (err) return done(err);
		mq.executeQuery(job._id);
		done();
	});
};

module.exports = handler;
