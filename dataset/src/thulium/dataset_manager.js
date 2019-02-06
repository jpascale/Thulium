const { Dataset, DatasetTable } = require('@thulium/internal');

class DatasetManager {

  constructor(dataset) {
    if (!dataset) throw new Error('DatasetManager#constructor dataset was not received.');
    this.dataset = dataset;
  }

  getTitle() {
    return this.dataset.title;
  }

  createTable(tableName, columns, values, cb) {
    if (!tableName || !columns) {
      cb('Must receive a table name and columns');
    }

    const table = new DatasetTable({
      dataset: this.dataset._id,
      table_name: tableName,
      columns,
      values
    });

    table.save()
      .then(res => {
        cb(null, res);
      })
      .catch(err => {
        cb(err);
      });
  };

  getTables(cb) {
    if (cb) {
      DatasetTable.find({ dataset: this.dataset._id }, cb);
    } else {
      return DatasetTable.find({ dataset: this.dataset._id })
    }
  }

  deleteTable() {
    throw new Error('Not implemented');
  };
  createInstance() {
    throw new Error('Not implemented');
  };
}

module.exports = { DatasetManager };