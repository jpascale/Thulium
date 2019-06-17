const { PostgresStorage, MySQLStorage } = require('@thulium/storage')
  , { connect } = require("@thulium/internal")
  , { Config } = require('@thulium/base')
  , debug = require('debug')('api:boot')
  , async = require('async')
  , bootstrapModules = require('./bootstrap');

debug('setting up postgres config');
PostgresStorage.config(Config.storage.postgres);

debug('setting up mysql config');
MySQLStorage.config(Config.storage.mysql);

async.series([
  connect,
  cb => async.auto(bootstrapModules, cb)
], (err) => {
  if (err) {
    console.error(err);
    debug('failed to connect to internal storage')
    process.exit(1);
  }
  // continue setup
  require('./app');
});