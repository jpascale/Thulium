const { PostgresStorage, InternalStorage } = require('@thulium/storage')
    , { config } = require('@thulium/base')
    , debug = require('debug')('api:boot')

debug('setting up postgres config');
PostgresStorage.config(config.postgres);

InternalStorage.connect((err) => {
  if (err) {
    console.error(err);
    debug('failed to connect to internal storage')
    process.exit(1);
  }
  // continue setup
  require('./app');
})