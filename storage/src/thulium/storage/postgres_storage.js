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

  }

  async connect() {
    return this.pool.connect();
  }

  query(queryStr, callback) {
    if (callback) {
      const cb = (res) => cb(res.rows);
      this.pool.query(this.queryStr, cb);
    } else {
      return this.pool.query(queryStr);
    }
  }

}

module.exports = PostgresStorage;
