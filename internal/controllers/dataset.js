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

Dataset.statics.create = function ({ paradigm, title, exam, items, userId, actions, ...options }, done) {
	debug('creating dataset');
	const self = this;
	const dataset = new self({
		_id: mongoose.Types.ObjectId(),
		publisher: userId,
		title,
		paradigm,
		exam,
		actions
	});

	Object.assign(dataset, options);

	const reducedDataset = (() => {
		if (!exam) return null;
		return new self({
			_id: mongoose.Types.ObjectId(),
			publisher: userId,
			title,
			paradigm,
			actions,
			full: dataset._id
		});
	})();
	if (reducedDataset) {
		dataset.reduced = reducedDataset._id
	}

	debug('creating items and entries');

	const datasetItems = items.map(({ title, data, headers, types, reduced }) => {
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

		if (!exam) {
			return [item, entries];
		}

		const reducedItem = new DatasetItem({
			_id: mongoose.Types.ObjectId(),
			dataset: reducedDataset._id,
			title,
			headers: reduced.headers.reduce((memo, h, i) => {
				memo[h] = reduced.types[i];
				return memo;
			}, {})
		});
		const reducedEntries = reduced.data.map((reducedData, index) => (
			new DatasetEntry({
				dataset: reducedDataset._id,
				dataset_item: reducedItem._id,
				index,
				data: reducedData
			})
		));

		return [item, entries, reducedItem, reducedEntries];
	});

	const persistableData = flatten([dataset, reducedDataset].filter(Boolean).concat(datasetItems));

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

Dataset.methods.createInstances = function ({ owner, engine, exam }, done) {
	const self = this;

	debug('creating instance for dataset %s (owner: %s, engine: %s, exam: %s)', self._id, owner, engine, exam);

	async.auto({
		instance: next => {
			debug('fetching existing instance');
			DatasetInstance.findOne({ dataset: self._id, owner, exam, engine }).exec(next);
		},
		dbItems: ['instance', ({ instance }, next) => {
			if (instance) return next(null, []);
			debug('fetching mongo items');
			DatasetItem.find({ dataset: self._id }).select('title headers').exec(next);
		}],
		dbEntries: ['instance', ({ instance }, next) => {
			if (instance) return next(null, []);
			debug('fetching mongo entries');
			DatasetEntry.find({ dataset: self._id }).select('dataset_item index data').sort({ index: 1 }).exec(next);
		}],
		instances: ['dbItems', 'dbEntries', ({ instance, dbItems, dbEntries }, next) => {
			if (instance) return next(null, []);
			debug('creating physical dataset');
			const entriesPerItem = dbEntries.reduce((memo, v) => {
				if (!memo[v.dataset_item])
					memo[v.dataset_item] = [];
				memo[v.dataset_item].push(v);
				return memo;
			}, {});
			const items = dbItems.map(i => ({
				title: i.title,
				headers: Array.from(i.headers.keys()),
				types: Array.from(i.headers.values()),
				data: entriesPerItem[i._id].map(e => e.data)
			}));
			StorageService.createDataset({ items }, {
				engines: [engine],
				nonce: owner.toString() + (exam || '').toString()
			}, next);
		}],
		create: ['instances', ({ instances }, next) => {
			if (!instances.length) return next(null, []);
			async.each(instances, ({ engine, tables }, cb) => {
				const instance = new DatasetInstance({
					dataset: self._id,
					owner,
					engine,
					tables,
					exam
				});
				instance.save(cb);
			}, next);
		}]
	}, err => {
		debug('done persisting in storages');
		if (err) console.error(err);
		done(err);
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