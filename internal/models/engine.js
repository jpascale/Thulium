const mongoose = require('mongoose')
		, debug = require('debug')('internal:models:engine');

debug('configuring engine schema');

const Engine = mongoose.Schema({
	_id: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	},
	last_updated: {
		type: Date
	},
	title: {
		type: String
	},
	enabled: {
		type: Boolean
	},
	mimeType: {
		type: String
	}
	/// other meta information
});

module.exports = Engine;