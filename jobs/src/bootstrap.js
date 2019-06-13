const { connect } =require('@thulium/internal')
		, { PostgresStorage } = require('@thulium/storage')
		, { Config } = require('@thulium/base')
		, debug = require('debug')('jobs:bootstrap');

debug('setting up postgres config');
PostgresStorage.config(Config.storage.postgres);

debug('connecting to internal storage');
connect(err => {
	if (err) {
		console.error('Failed to connect to internal storage');
		return;
	}
	require('./server');
});