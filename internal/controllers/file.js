const mongoose = require('mongoose')
		, debug = require('debug')('internal:controllers:file')
		, { File } = require('../models');

debug('setting up file controller');

File.pre('save', function (next) {
	this.last_updated = Date.now();
	next();
});

module.exports = mongoose.model('File', File);