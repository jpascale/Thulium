const mongoose = require('mongoose')
		, debug = require('debug')('internal:controllers:job')
		, { Job } = require('../models');

debug('setting up job controller');

Job.pre('save', function (next) {
	this.last_updated = Date.now();
	next();
});

Job.pre('save', function (next) {
	if (this.isNew) return next();
	if (!this.isModified('status')) return next();
	this[this.status] = new Date();
	next();
});

module.exports = mongoose.model('Job', Job);