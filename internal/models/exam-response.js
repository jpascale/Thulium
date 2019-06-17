const mongoose = require('mongoose')
  , debug = require('debug')('internal:models:exam-response');

debug('configuring exam response');

const ExamResponse = mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  },
  question: {
    type: mongoose.Schema.Types.ObjectId
  },
  response: {
    type: String,
  },
  review: {
    type: Boolean
  },
  hint: {
    type: Boolean
  }
});

module.exports = ExamResponse;
