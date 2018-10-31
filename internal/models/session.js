const mongoose = require('mongoose')
		, debug = require('debug')('internal:models:session');

debug('configuring session schema');

const Session = mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},
	last_updated: {
		type: Date
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	files: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'File'
	}]
});

module.exports = Session;