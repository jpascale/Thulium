const mongoose = require('mongoose')
	, debug = require('debug')('internal:models:exam');

debug('configuring exam schema');

const Exam = mongoose.Schema({
	title: {
		type: String
	},
	questions: [{
		content: {
			type: String,
		},
		type: {
			type: String,
			lowercase: true,
			/**
			 * tf: True or False,
			 * mc: Multiple choice
			 * wa: Written answer
			 * qr: Query response
			 */
			enum: ['true-false', 'multiple-choice', 'written-answer', 'query-response']
		},
		dataset: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Dataset'
		},
		engine: {
			type: String,
			ref: 'Engine'
		},
		/**
		 * We use a mixed value to support all types of answers
		 * 
		 * If type is true-false => true/false
		 * If type is multiple-choice => A/B/C/D
		 * If type is writter-answer => null
		 * If type is query-response => 'SELECT * FROM ..'
		 **/
		correct_answer: {
			type: mongoose.Schema.Types.Mixed
		},

		/// Store optional information
		options: {
			type: mongoose.Schema.Types.Mixed
		}
	}],
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	/// Blackboard stuff
	contentId: {
		type: String
	},
	gradeColumnId: {
		type: String
	}
});

module.exports = Exam;