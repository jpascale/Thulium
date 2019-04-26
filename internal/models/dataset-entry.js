const mongoose = require('mongoose')
  , debug = require('debug')('internal:models:dataset-entry');

debug('configuring dataset entry schema');

const DatasetEntry = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  last_updated: {
    type: Date,
    default: Date.now
  },
  dataset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dataset',
    index: true
  },
  dataset_item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DatasetItem',
    index: true
  },
  index: {
    type: Number,
    index: true
  },
  data: [{
    type: mongoose.Schema.Types.Mixed
  }]
});

module.exports = DatasetEntry;