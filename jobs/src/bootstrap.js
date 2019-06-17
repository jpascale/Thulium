const { connect } =require('@thulium/internal')
		, { PostgresStorage, MySQLStorage } = require('@thulium/storage')
		, { Config } = require('@thulium/base')
		, debug = require('debug')('jobs:bootstrap');

debug('setting up postgres config');
PostgresStorage.config(Config.storage.postgres);

debug('setting up mysql config');
MySQLStorage.config(Config.storage.mysql);

debug('connecting to internal storage');
connect(err => {
	if (err) {
		console.error('Failed to connect to internal storage');
		return;
	}
	require('./server');
});