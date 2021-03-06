const Storages = require('./storages')
    , async = require('async')
    , debug = require('debug')('storage:service');

const Module = {};
const allStorages = Object.values(Storages);

Module.getEngineDatabaseService = function (engine) {
  const mimeMap = {
    psql: PostgresService
  }

  return mimeMap[engine];
};

Module.createDataset = (dataset, { engines, nonce }, done) => {
  const storages = (() => {
    if (!engines.length) return allStorages;
    return allStorages.filter(s => ~engines.indexOf(s.id()));
  })();
  debug(`creating dataset in ${storages.length} storage engines`);
  async.map(storages, (storage, cb) => {
    storage.createDataset({ ...dataset, nonce }, cb);
  }, done);
};

module.exports = Module;