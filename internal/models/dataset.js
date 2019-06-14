const mongoose = require('mongoose')
	, debug = require('debug')('internal:models:dataset');

debug('configuring dataset schema');

const Dataset = mongoose.Schema({
	title: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	},
	last_updated: {
		type: Date,
		default: Date.now
	},
	publisher: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	paradigm: {
		type: String,
		lowercase: true,
		enum: ['sql', 'nosql']
	},
	items: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'DatasetItem'
	}],
	access: {
		/* defined access levels or 'owner'. 'admin' role should be always able to access. */
		type: String,
		enum: ['owner', 'student', 'teacher', 'anonymous']
	},
	persisted: {
		type: Boolean
	},
	exam: {
		type: Boolean
	},
	reduced: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Dataset'
	},
	default: {
		type: Boolean
	}
});

module.exports = Dataset;