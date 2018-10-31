const mongoose = require('mongoose')
		, debug = require('debug')('internal:models:file');

debug('configuring file schema');

const File = mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	engine: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Engine'
	},
	dataset: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Dataset'
	},
	title: {
		type: String
	},
	content: {
		type: String
	}
});

module.exports = File;