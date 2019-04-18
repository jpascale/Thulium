const mongoose = require('mongoose')
	, debug = require('debug')('internal:controllers:dataset')
	, { Dataset } = require('../models')
	, { DatasetTable } = require('../controllers');

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
Dataset.methods.createInstance = function () {
	throw new Error('Not implemented');
};

/**
 * Static methods
 */

Dataset.statics.byUser = function (user, cb) {
	if (!user) throw new Error('User must be provided.');
	this.find({ publisher: user }, cb);
}

module.exports = mongoose.model('Dataset', Dataset);