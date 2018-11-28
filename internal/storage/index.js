const mongoose = require('mongoose')
	, debug = require('debug')('storage:internal')
	, { storage } = require('@thulium/base').Config;

const uri = `mongodb://${storage.internal.user}:${storage.internal.password}@${storage.internal.host}:${storage.internal.port}/${storage.internal.database}`;

const connect = (cb) => {
	debug('connecting to internal storage')
	if (mongoose.connection.readyState) {
		debug('already connected');
		return cb();
	}

	mongoose.connection.on('connected', ref => {
		debug('Connected to DB!');
	});

	mongoose.connection.on('error', err => {
		console.error(err);
		debug(`Failed to connect to db ${err.message}`);
	});

	mongoose.connection.on('disconnected', err => {
		debug(`Mongoose default connection disconnected`);
	});

	mongoose.connect(uri, { useNewUrlParser: true }, cb);
};

module.exports = {
	connect
};