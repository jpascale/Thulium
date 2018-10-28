const {Manager} = require('./manager.js'),
	{PostgresStorage: storage} = require('@thulium/storage'),
	{config} = require('@thulium/base');

class PSQLManager extends Manager{

	constructor(){
		super('psql');
		storage.config(config.postgres);
	}

	manage(msg, callback, err_callback,client){
		return storage.query(msg, (err, response) => {
			if (err) {
				err_callback(client,{response : err});
				return;
			}
			callback(client,{response : response});
		});

	}
}

exports.PSQLManager = PSQLManager;