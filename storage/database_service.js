const { PostgresService } = require('./service/postgres_service');
Module = {}

Module.getEngineDatabaseService = function (engine) {
  const mimeMap = {
    psql: PostgresService
  }

  return mimeMap[engine];
}

module.exports = Module;