const { Dataset } = require('@thulium/internal')
	, COMPARE_WITH_REDUCED = 'compare with reduced'
	, debug = require('debug')('jobs:compare-with-reduced')
	, async = require('async')
	, { Exam, ExamResponse } = require('@thulium/internal')
	, { job: createDatasetInstance } = require('./create-dataset-instance')
	, { job: executeQuery } = require('./execute-query')
	, every = require('../util/every');

/**
 * Executes the query submited in both the normal and the hidden dataset
 */
const job = ({ response, question, owner, exam, file }, done) => {
	async.auto({
		exam: next => {
			debug('fetching exam');
			Exam.findById(exam).exec(next);
		},
		instance: ['exam', ({ exam }, next) => {
			debug('fetching dataset');
			const q = exam.questions.find(q => q._id.toString() === question.toString());
			if (q.type !== 'query-response') {
				return next('not applicable');
			}
			createDatasetInstance({
				dataset: q.dataset,
				engine: q.engine,
				owner,
				exam: exam._id,
				reduced: true
			}, next);
		}],
		results: ['instance', 'exam', ({ instance, exam }, next) => {
			async.parallel({
				full_submitted: next => {
					debug('running query in full dataset with submitted answer');
					executeQuery({ file }, next);
				},
				full_correct: next => {
					debug('running query in full dataset with correct answer');
					executeQuery({ file, content: exam.correct_answer }, next);
				},
				reduced_submitted: next => {
					debug('running query in reduced dataset with submitted answer');
					executeQuery({ file, reduced: true }, next);
				},
				reduced_correct: next => {
					debug('running query in full dataset with correct answer');
					executeQuery({ file, content: exam.correct_answer, reduced: true }, next);
				}
			}, next)
		}],
		submit: ['results', ({ results }, next) => {
			const { full_submitted, full_correct, reduced_submitted, reduced_correct } = results;

			const hintFinder = ((submitted, correct) => {
				if (submitted.count !== correct.count) return false;
				if (submitted.columns.length !== correct.columns.length) return false;
				const columnsAreTheSame = every(submitted.columns, cf => {
					return correct.columns.find(cr => cr === cf);
				});
				if (!columnsAreTheSame) return false;
				return every(submitted.records, (submittedRecord, i) => {
					const correctRecord = correct.records[i];
					return every(Object.keys(submittedRecord), key => {
						return submittedRecord[key] === correctRecord[key];
					});
				});
			});

			const hint = hintFinder(full_submitted, full_correct) && hintFinder(reduced_submitted, reduced_correct)

			debug('updating response %s with hint=%s', response, hint);

			ExamResponse.findOneAndUpdate({ _id: response }, { hint }, next);
		}]
	}, err => {
		if (err) {
			if (err === 'not applicable') {
				return;
			}
			console.error(err);
			return done(err);
		}
		done();
	});
};

module.exports = {
	key: COMPARE_WITH_REDUCED,
	job
};



