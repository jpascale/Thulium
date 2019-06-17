const { Dataset } = require('@thulium/internal')
		, COMPARE_WITH_REDUCED = 'compare with reduced'
		, debug = require('debug')('jobs:compare-with-reduced')
		, async = require('async')
		, { Exam, ExamResponse } = require('@thulium/internal')
		, { job: createDatasetInstance } = require('./create-dataset-instance')
		, { job: executeQuery } = require('./execute-query')
		, every = require('../util/every');

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
		results: ['instance', (_, next) => {
			async.parallel({
				full: next => {
					debug('running query in full dataset');
					executeQuery({ file }, next);
				},
				reduced: next => {
					debug('running query in full dataset');
					executeQuery({ file, reduced: true }, next);
				}
			}, next);
		}],
		submit: ['results', ({ results }, next) => {
			const { full, reduced } = results;

			const hint = (() => {
				if (full.count !== reduced.count) return false;
				if (full.columns.length !== reduced.columns.length) return false;
				const columnsAreTheSame = every(full.columns, cf => {
					return reduced.columns.find(cr => cr === cf);
				});
				if (!columnsAreTheSame) return false;
				return every(full.records, (fullRecord, i) => {
					const reducedRecord = reduced.records[i];
					return every(Object.keys(fullRecord), key => {
						return fullRecord[key] === reducedRecord[key];
					});
				});
			})();

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



