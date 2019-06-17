const { Dataset } = require('@thulium/internal')
		, COMPARE_WITH_REDUCED = 'compare with reduced'
		, debug = require('debug')('jobs:compare-with-reduced')
		, { job: createDatasetInstance } = require('./create-dataset-instance')
		, { job: executeQuery } = require('./execute-query');

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
				exam,
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
  }, (err, { results }) => {
    if (err) {
      if (err === 'not applicable') {
        return;
      }
      console.error(err);
      return done(err);
		}
		debug(results);
		done();
  });
};

module.exports = {
	key: COMPARE_WITH_REDUCED,
	job
};



