/**
 * Helper to translate Mongo objects to Postgres SQL language
 */
const async = require('async'),
  PostgresStorage = require('../psql');

Module = {}

/**
 * createTableSentence
 * Converts Mongo table object to a SQL sentence.
 */
// TODO: support multiple PKs.
Module.createTableSentence = (table, namesMap) => {

  const typeMap = {
    int: 'INTEGER',
    string: 'VARCHAR(255)',
    float: 'NUMERIC'
  };

  let str = `CREATE TABLE ${namesMap[table.title]}(` + table.columns.map((col) => {
    if (!typeMap[col.data_type]) {
      throw new Error(`Trying to create a dataType that doesn\'t exist. DataType: ${col.data_type}, typeMap: ${JSON.stringify(typeMap)}`);
    }
    let auxStr = `${col.name} ${typeMap[col.data_type]}`;

    /**
     * Specific Postgres custom options
     */

    // PK -- This should be done at the end using the constraint way: PK(id1, id2, ...)
    if (col.options.pk) {
      auxStr += ' PRIMARY KEY';
    }
    if (col.options.not_null) {
      auxStr += ' NOT NULL';
    }

    return auxStr;
  }).join(',') + ');';

  return str;
}

Module.createInsertionSentence = (table, namesMap) => {
  const physicalName = namesMap[table.title];
  const values = table.values.map(obj => {
    return '(' + table.columns.map(column => {
      if (column.data_type === 'int' || column.data_type === 'float') {
        return `${obj[column.name]}`;
      } else {
        return `'${obj[column.name]}'`;
      }
    }).join(', ') + ')';
  }).join(', ');
  const str = `INSERT INTO ${physicalName} (${table.columns.map((t) => t.name).join(', ')}) VALUES ${values}`;
  return str;
}

// Create datasets directly, without jobs
Module.createPhysicalDataset = ({ datasetInstance, tables }, callback) => {

  // Table creation
  async.eachLimit(tables, 1, (table, cb) => {
    const query = Module.createTableSentence(table, datasetInstance.tables);
    PostgresStorage.query(query).then(cb).catch(err => {
      console.log('#PSQL Rejected promise while creating table');
      console.log(err);
      cb();
    });
  }, (err) => {
    if (err) {
      throw new Error(err);
    }

    // Data insertion
    async.eachLimit(tables, 1, (table, cb) => {
      const query = Module.createInsertionSentence(table, datasetInstance.tables);
      PostgresStorage.query(query).then(cb).catch(err => {
        console.log('#PSQL Rejected promise while inserting data');
        console.log(err);
        cb();
      });
    }, (err) => {
      if (err) {
        throw new Error(err);
      }

      callback && callback();
    });


  });
}

module.exports = Module;