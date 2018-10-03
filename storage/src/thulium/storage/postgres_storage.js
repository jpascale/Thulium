const { Pool } = require('pg');

const Module = {};

const pool;

Module.config = (config) => {
  if (pool) return;
  pool = new Pool(config);
};

Module.query = () => {
  if (!pool) {
    throw new Error('module has no config');
  }
  return pool.query.apply(pool, arguments);
};

module.exports = Module;
