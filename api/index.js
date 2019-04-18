const { PostgresStorage } = require('@thulium/storage')
  , { connect } = require("@thulium/internal")
  , { Config } = require('@thulium/base')
  , { setup } = require('./agenda')
  , debug = require('debug')('api:boot')
  , async = require('async')
  , bootstrapModules = require('./bootstrap');

debug('setting up postgres config');
PostgresStorage.config(Config.storage.postgres);

const bootModule = (bootModule, next) => bootModule.boot(next);

async.series([
  connect,
  setup,
  cb => async.each(bootstrapModules, bootModule, cb)
], (err) => {
  if (err) {
    console.error(err);
    debug('failed to connect to internal storage')
    process.exit(1);
  }
  // continue setup
  require('./app');
});