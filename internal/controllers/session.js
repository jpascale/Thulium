const mongoose = require('mongoose')
		, debug = require('debug')('internal:controllers:session')
		, { Session } = require('../models');

debug('setting up session controller');

Session.pre('save', function (next) {
	this.last_updated = Date.now();
	next();
});

module.exports = mongoose.model('Session', Session);