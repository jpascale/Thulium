const mongoose = require('mongoose')
  , debug = require('debug')('internal:controllers:dataset_table')
  , { DatasetTable } = require('../models');

debug('setting up dataset_table controller');

DatasetTable.pre('save', function (next) {
  this.last_updated = Date.now();
  next();
});

module.exports = mongoose.model('DatasetTable', DatasetTable);