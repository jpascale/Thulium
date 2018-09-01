const { Pool } = require('pg');


class PostgresStorage {

  constructor(config) {
    this.pool = new Pool({
      user: 'jpascale',
      host: 'localhost',
      database: 'test',
      password: '',
      port: 5432,
    })

    pool.query('SELECT NOW()', (err, res) => {
      console.log(err, res)
      pool.end()
    })
  }

  dropTable(tableName, callback) {
    const queryStr = `DROP TABLE $1;`
    if (callback) {
      this.pool.query(queryStr, [tableName], callback);
    } else {
      return this.pool.query(queryStr, [tableName]);
    }
  }

  //TODO: check types: int, smallint, real, double precision, char(N), varchar(N), date, time, timestamp, and interval
  createTable(tableName, fields, callback) {
    const paramStr = Object.keys(fields).map((_, index) => `$${2 * index + 1} $${2 * index + 2}`).join(', ')
    const queryStr = `CREATE TABLE ${tableName} (${paramStr});`;
    const args = Object.keys(fields).reduce((prev, curr) => {
      prev.push(curr);
      prev.push(fields[curr]);
      return prev
    }, []);

    if (callback) {
      this.pool.query(queryStr, args, callback);
    } else {
      return this.pool.query(queryStr, args);
    }

  }

}

module.exports = PostgresStorage;
