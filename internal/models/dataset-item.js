const mongoose = require('mongoose')
  , debug = require('debug')('internal:models:dataset-item');

debug('configuring dataset_item schema');

const DatasetItem = mongoose.Schema({
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
  title: {
    type: String,
  },
  headers: {
    type: Map,
    of: String
    // title: String,
    // type: {
    //   type: String,
    //   enum: ['Int', 'String', 'Float', 'Boolean']
    // },
  }
});

module.exports = DatasetItem;