const { PostgresStorage } = require('@thulium/storage')
    , { connect } = require("@thulium/internal")
    , { config } = require('@thulium/base')
    , debug = require('debug')('api:boot')

debug('setting up postgres config');
PostgresStorage.config(config.postgres);

connect((err) => {
  if (err) {
    console.error(err);
    debug('failed to connect to internal storage')
    process.exit(1);
  }
  // continue setup
  require('./app');
})