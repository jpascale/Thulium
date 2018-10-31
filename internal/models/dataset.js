const mongoose = require('mongoose')
		, debug = require('debug')('internal:models:dataset');

debug('configuring dataset schema');

const Dataset = mongoose.Schema({
	publisher: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	engine: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Engine'
	},
	title: {
		type: String
	}
});

module.exports = Dataset;