const mongoose = require('mongoose')
    , debug = require('debug')('internal:controllers:dataset-entry')
    , { DatasetEntry } = require('../models');

debug('setting up dataset entry controller');

module.exports = mongoose.model('DatasetEntry', DatasetEntry);