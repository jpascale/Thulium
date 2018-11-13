const mongoose = require('mongoose')
		, debug = require('debug')('internal:controllers:file')
		, { File } = require('../models')
		, omit = require('lodash/omit');

debug('setting up file controller');

File.pre('save', function (next) {
	this.last_updated = Date.now();
	next();
});

File.methods.dto = function () {
	return omit(this.toObject(), '__v', 'created', 'last_updated');
};

module.exports = mongoose.model('File', File);