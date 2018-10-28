const {PostgresStorage: storage} = require('@thulium/storage'),
	{config} = require('@thulium/base');

const PSQLManager = {};

PSQLManager.config = function () {
	//TODO CHANGE CONFIG TO SESSION PASSED
	storage.config(config.postgres);
};

PSQLManager.manage = function(msg, client, callback){
	return storage.query(msg, (err, response) => {
		callback(client,err, response);
	});
};

exports.PSQLManager = PSQLManager;