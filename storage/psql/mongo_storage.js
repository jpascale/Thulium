const mongoose = require('mongoose');

const Module = {};

let strConnect;
let configured;

Module.config = (config) => {
  if (configured) return;
  // TODO: Add auth
  strConnect = `mongodb://${config.hostname}:${config.port}/${config.database}`
  mongoose.connect(strConnect);
};

mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + strConnect);
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

require('../models/users');

module.exports = Module;
