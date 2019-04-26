const mongoose = require('mongoose')
  , debug = require('debug')('internal:controllers:dataset_table')
  , { DatasetItem } = require('../models');

debug('setting up dataset_item controller');

DatasetItem.pre('save', function (next) {
  this.last_updated = Date.now();
  next();
});

module.exports = mongoose.model('DatasetItem', DatasetItem);