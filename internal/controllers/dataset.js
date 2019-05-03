const mongoose = require('mongoose')
	, debug = require('debug')('internal:controllers:dataset')
	, async = require('async')
	, { Dataset } = require('../models')
	, DatasetItem = require('./dataset-item')
	, DatasetEntry = require('./dataset-entry')
	, DatasetInstance = require('./dataset-instance')
	, { Util } = require('@thulium/base')
	, { StorageService } = require('@thulium/storage');

debug('setting up dataset controller');

/**
 * Hooks
 */
Dataset.pre('save', function (next) {
	this.last_updated = Date.now();
	next();
});

/**
 * Static methods
 */

const flatten = coll => coll.reduce((a, b) => a.concat(b), []);

Dataset.statics.create = function ({ title, paradigm, items, userId }, done) {
	debug('creating dataset');
	const self = this;
	const dataset = new self({
		_id: mongoose.Types.ObjectId(),
		publisher: userId,
		title,
		paradigm
	});
	debug('creating items and entries');
	const datasetItems = items.map(({ title, data, headers, types }) => {
		const item = new DatasetItem({
			_id: mongoose.Types.ObjectId(),
			dataset: dataset._id,
			title,
			headers: headers.reduce((memo, h, i) => {
				memo[h] = types[i];
				return memo;
			}, {})
		});
		const entries = data.map((data, index) => (
			new DatasetEntry({
				dataset: dataset._id,
				dataset_item: item._id,
				index,
				data
			})
		));
		return [item, entries];
	});
	const persistableData = flatten([dataset].concat(datasetItems));
	debug('persisting data');
	async.each(persistableData, (doc, next) => {
		if (Array.isArray(doc)) {
			debug('persisting entries');
			async.eachLimit(doc, 100, (d, cb) => {
				d.save(cb);
			}, next);
			return;
		}
		doc.save(next);
	}, done);

	async.waterfall([
		next => {
			debug('creating physical dataset');
			StorageService.createDataset({
				// title,
				// paradigm,
				items
			}, next);
		},
		(instances, next) => {
			async.each(instances, ({ engine, tables }, cb) => {
				const instance = new DatasetInstance({
					dataset: dataset._id,
					engine,
					tables
				});
				instance.save(cb);
			}, next);
		}
	], err => {
		if (err) {
			/// TODO: wtf do we do here?
			console.error(err);
			return;
		}
		debug('done persisting in storages');
	});
};

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

Dataset.methods.createInstance = function (title, owner, engine, done) {
	const self = this;

	async.waterfall([
		cb => DatasetTable.find({ dataset: dataset._id }, cb),
		(datasetTables, cb) => {
			const tables = datasetTables.reduce((prev, curr) => {
				prev[curr.table_name] = Util.generateId('table', [owner.email, engine.title, title, table_name])
				return prev;
			}, {});

			const datasetInstance = new DatasetInstance({
				title,
				dataset: self._id,
				owner: owner._id,
				engine: engine._id,
				tables
			});

			datasetInstance.save(cb)
		},
		(instance, cb) => {
			// Persist data on real database
			const databaseService = DatabaseService.getEngineDatabaseService(engine.mimeType);
			databaseService.createPhysicalDataset({
				tables: res,
				datasetInstance
			}, cb);
		}
	], done);

	// DatasetTable.find({ dataset: dataset._id }, (err, res) => {

	// 	if (err) {
	// 		console.log(err);
	// 		return;
	// 	}

	// 	const tables = res.reduce((prev, curr) => {
	// 		prev[curr.table_name] = Util.generateId('table', [owner.email, engine.title, title, table_name])
	// 		return prev;
	// 	}, {})

	// 	const datasetInstance = new DatasetInstance({
	// 		title,
	// 		dataset: self._id,
	// 		owner: owner._id,
	// 		engine: engine._id,
	// 		tables: tables
	// 	});

	// 	datasetInstance.save((err) => {
	// 		if (err) {
	// 			console.log(err);
	// 			return;
	// 		}

	// 		// Persist data on real database
	// 		const databaseService = DatabaseService.getEngineDatabaseService(engine.mimeType);
	// 		databaseService.createPhysicalDataset({
	// 			tables: res,
	// 			datasetInstance
	// 		});

	// 	});
	// });

};

/**
 * Static methods
 */

Dataset.statics.byUser = function (user, cb) {
	if (!user) throw new Error('User must be provided.');
	this.find({ publisher: user }, cb);
}

module.exports = mongoose.model('Dataset', Dataset);