const mongoose = require('mongoose')
  , debug = require('debug')('internal:controllers:dataset_instance')
  , { DatasetInstance } = require('../models');

debug('setting up dataset_instance controller');

module.exports = mongoose.model('DatasetInstance', DatasetInstance);