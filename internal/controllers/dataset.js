const mongoose = require('mongoose')
	, debug = require('debug')('internal:controllers:dataset')
	, { Dataset } = require('../models')
	, { DatasetTable } = require('../controllers')
	, { Util } = require('@thulium/base')
	, { DatabaseService } = require('@thulium/storage');

debug('setting up dataset controller');

/**
 * Hooks
 */
Dataset.pre('save', function (next) {
	this.last_updated = Date.now();
	next();
});

/**
 * Instance methods
 */
Dataset.methods.getTitle = function (cb) {
	const self = this;
	return self.title;
}

Dataset.methods.createTable = function (tableName, columns, values, cb) {
	const self = this;
	if (!tableName || !columns) {
		cb(new Error('Must receive a table name and columns'));
	}

	const table = new DatasetTable({
		dataset: self._id,
		table_name: tableName,
		columns,
		values
	});

	table.save(cb);
}


Dataset.methods.getTables = function (cb) {
	const self = this;
	DatasetTable.find({ dataset: self._id }, cb);
};

Dataset.methods.deleteTable = function () {
	throw new Error('Not implemented');
};
Dataset.methods.createInstance = function (title, owner, engine, cb) {
	const self = this;

	DatasetTable.find({ dataset: dataset._id }, (err, res) => {

		if (err) {
			console.log(err);
			return;
		}

		const tables = res.reduce((prev, curr) => {
			prev[curr.table_name] = Util.generateId('table', [owner.email, engine.title, title, table_name])
			return prev;
		}, {})

		const datasetInstance = new DatasetInstance({
			title,
			dataset: self._id,
			owner: owner._id,
			engine: engine._id,
			tables: tables
		});

		datasetInstance.save((err) => {
			if (err) {
				console.log(err);
				return;
			}

			// Persist data on real database
			const databaseService = DatabaseService.getEngineDatabaseService(engine.mimeType);
			databaseService.createPhysicalDataset({
				tables: res,
				datasetInstance
			});

		});
	});

};

/**
 * Static methods
 */

Dataset.statics.byUser = function (user, cb) {
	if (!user) throw new Error('User must be provided.');
	this.find({ publisher: user }, cb);
}

module.exports = mongoose.model('Dataset', Dataset);