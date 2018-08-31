const { Pool } = require('pg');

class PostgresStorage {

  constructor(config) {
    const pool = new Pool({
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

}
module.exports = PostgresStorage;
