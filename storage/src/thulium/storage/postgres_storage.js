const { Pool } = require('pg');

class PostgresStorage {

  constructor(config, InjectedPool) {
    const CurrPool = InjectedPool || Pool;
    this.pool = new CurrPool({
      user: config.user,
      host: config.hostname,
      database: config.database,
      password: config.password,
      port: config.port,
    });
    this.connected = false;
  }

  connect() {
    if (!this.connected) {
      return this.pool.connect()
        .then(() => {
          this.connected = true;
        });
    }

    return Promise.resolve(this.pool);
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
