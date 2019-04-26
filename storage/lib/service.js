const Storages = require('./storages')
    , async = require('async')
    , debug = require('debug')('storage:service');

const Module = {};

const storages = [Storages.PostgresStorage];

// Object.values(Storages);

Module.getEngineDatabaseService = function (engine) {
  const mimeMap = {
    psql: PostgresService
  }

  return mimeMap[engine];
};

Module.createDataset = (dataset, done) => {
  debug(`creating dataset in ${storages.length} storage engines`);
  async.map(storages, (storage, cb) => {
    storage.createDataset(dataset, cb);
  }, done);
};

module.exports = Module;