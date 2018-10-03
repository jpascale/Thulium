const { config } = require('@thulium/base'),
  { PostgresStorage } = require('@thulium/storage'),
  { Pool } = require('pg');

module.exports = {
  postgresStorage: new PostgresStorage(config.postgres, Pool)
};