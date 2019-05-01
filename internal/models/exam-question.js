const mongoose = require('mongoose')
  , debug = require('debug')('internal:models:exam-question');

debug('configuring exam question schema');

const ExamQuestion = mongoose.Schema({
  task: {
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
    enum: ['tf', 'mc', 'wa', 'qr']
  },
  // Maybe we should support an array of datasets?
  dataset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dataset'
  },
  engine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Engine'
  },
  correct_answer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamResponse'
  }
});

module.exports = ExamQuestion;
