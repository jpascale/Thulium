const mongoose = require('mongoose')
  , debug = require('debug')('internal:controllers:exam-question')
  , { ExamQuestion } = require('../models');

debug('setting up exam controller');

module.exports = mongoose.model('ExamQuestion', ExamQuestion);