const { Pool } = require('pg');


class PostgresStorage {

  constructor(config, pool) {
    this.pool = pool || new Pool({
      user: 'jpascale',
      host: '127.0.0.1',
      database: 'test',
      password: '',
      port: 5432,
    });

  }

  connect() {
    return this.pool.connect();
  }

  query(queryStr, callback) {
    if (callback) {
      this.pool.query(queryStr, callback);
    } else {
      return this.pool.query(queryStr);
    }
  }

}

module.exports = PostgresStorage;
