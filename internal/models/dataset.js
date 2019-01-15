const mongoose = require('mongoose')
	, debug = require('debug')('internal:models:dataset');

debug('configuring dataset schema');

const Dataset = mongoose.Schema({
	title: String,
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
		/* sql, nosql*/
		type: String,
		enum: ['sql', 'nosql']
	},
	access: {
		/* defined access levels or 'owner'. 'admin' role should be always able to access. */
		type: String,
		enum: ['owner', 'student', 'teacher', 'anonymous']
	}
});

module.exports = Dataset;