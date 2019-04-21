const mongoose = require('mongoose')
		, debug = require('debug')('internal:models:exam');

debug('configuring exam schema');

const Exam = mongoose.Schema({
	dataset: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Dataset'
	},
	contentId: {
		type: String
	},
	gradeColumnId: {
		type: String
	}
});

module.exports = Exam;