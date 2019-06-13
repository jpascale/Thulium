const mongoose = require('mongoose')
		, debug = require('debug')('internal:models:job');

debug('configuring job schema');

const Job = mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},
	last_updated: {
		type: Date
	},
	status: {
		type: String,
		enum: ['pending', 'received', 'completed', 'failed'],
		default: 'pending'
	},
	key: {
		type: String
	},
	params: {
		type: mongoose.Schema.Types.Mixed
	},
	received: {
		type: Date
	},
	completed: {
		type: Date
	},
	failed: {
		type: Date
	},
	error: {
		type: mongoose.Schema.Types.Mixed
	}
});

module.exports = Job;