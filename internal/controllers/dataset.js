const mongoose = require('mongoose')
		, debug = require('debug')('internal:controllers:dataset')
		, { Dataset } = require('../models');

debug('setting up dataset controller');

Dataset.pre('save', function (next) {
	this.last_updated = Date.now();
	next();
});

module.exports = mongoose.model('Dataset', Dataset);