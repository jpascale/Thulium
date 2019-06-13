const mongoose = require('mongoose')
  , debug = require('debug')('internal:models:dataset_instance');

debug('configuring dataset_instance schema');

const DatasetInstance = mongoose.Schema({
  // title: {
  //   type: String,
  //   index: true,
  //   lowercase: true
  // },
  dataset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dataset',
    index: true
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
  },
  /**
   * Used to check permission on tables.
   */
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  engine: {
    type: String,
    ref: 'Engine'
  },
  /**
   * Key: Name of the table.
   * Value: Name of the table as it is found in the database.
   */
  tables: {
    type: Map,
    of: String
  }
});

module.exports = DatasetInstance;