const mongoose = require('mongoose')
    , debug = require('debug')('internal:controllers:exam')
    , { Exam } = require('../models');

debug('setting up exam controller');

module.exports = mongoose.model('Exam', Exam);