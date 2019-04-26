const mongoose = require('mongoose')
		, debug = require('debug')('internal:models:file');

debug('configuring file schema');

const File = mongoose.Schema({
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
	engine: {
		type: String,
		ref: 'Engine'
	},
	dataset: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Dataset'
	},
	session: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Session'
	},
	title: {
		type: String
	},
	content: {
		type: String
	}
});

module.exports = File;