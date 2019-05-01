const mongoose = require('mongoose')
	, debug = require('debug')('internal:models:exam');

debug('configuring exam schema');

const Exam = mongoose.Schema({
	title: {
		type: String,
	},
	questions: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ExamQuestion'
	}],
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},

	contentId: {
		type: String
	},
	gradeColumnId: {
		type: String
	}
});

module.exports = Exam;