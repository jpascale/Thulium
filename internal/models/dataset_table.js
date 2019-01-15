const mongoose = require('mongoose')
  , debug = require('debug')('internal:models:dataset_table');

debug('configuring dataset_table schema');

const DatasetTable = mongoose.Schema({
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
  table_name: {
    type: String,
  },
  rows: [{
    name: String,
    /* int, string, float, boolean */
    data_type: {
      type: String,
      enum: ['int', 'string', 'float', 'boolean']
    },
    options: {}
  }],
  values: [mongoose.Schema.Types.Mixed]
});

module.exports = DatasetTable;