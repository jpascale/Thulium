const mongoose = require('mongoose')
  , debug = require('debug')('internal:controllers:exam-response')
  , { ExamResponse } = require('../models')
  , Exam = require('./exam')
  , Dataset = require('./dataset')
  , DatasetInstance = require('./dataset-instance');

debug('setting up exam response controller');

ExamResponse.pre('save', function (next) {
  this.wasNew = this.isNew;
  next();
});

ExamResponse.post('save', function () {
  if (!this.wasNew) return;

  const self = this;
  async.auto({
    exam: cb => {
      debug('fetching exam');
      Exam.findById(self.exam).exec(cb);
    },
    dataset: ['exam', ({ exam }, cb) => {
      debug('fetching dataset');
      const question = exam.questions.find(q => q._id.toString() === self.question.toString());
      if (question.type !== 'query-response') {
        return cb('not applicable');
      }
      Dataset.findById(question.dataset).populate('reduced').exec(cb);
    }],
    instance: ['exam', 'dataset', ({ exam, dataset }, cb) => {
      debug('create reduced instance');
      const question = exam.questions.find(q => q._id.toString() === self.question.toString());
      dataset.reduced.createInstance({
        engine: question.engine,
        owner: self.user,
        exam: self.exam
      }, cb);
    }],
    instances: ['instance', 'dataset', 'exam', ({ dataset, exam }, cb) => {
      debug('fetch instances');
      const question = exam.questions.find(q => q._id.toString() === self.question.toString());
      async.parallel({
        full: cb => {
          DatasetInstance.findOne({
            dataset: dataset._id,
            owner: self.user,
            engine: question.engine,
            exam: self.exam
          }, cb);
        },
        reduced: cb => {
          DatasetInstance.findOne({
            dataset: dataset.reduced._id,
            owner: self.user,
            engine: question.engine,
            exam: self.exam
          }, cb);
        }
      }, cb);
    }],
    runQueries: ['instances', ({ instances }, cb) => {
      const { full, reduced } = instances;
      
    }]
  }, (err, { results }) => {
    if (err) {
      if (err === 'not applicable') {
        return;
      }
      console.error(err);
      return;
    }
    

  });
});


module.exports = mongoose.model('ExamResponse', ExamResponse);