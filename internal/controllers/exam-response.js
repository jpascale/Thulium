const mongoose = require('mongoose')
  , debug = require('debug')('internal:controllers:exam-response')
  , { ExamResponse } = require('../models');

debug('setting up exam response controller');

module.exports = mongoose.model('ExamResponse', ExamResponse);