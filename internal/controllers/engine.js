const mongoose = require('mongoose')
		, debug = require('debug')('internal:controllers:engine')
		, { Engine } = require('../models');

debug('setting up engine controller');

Engine.pre('save', function (next) {
	this.last_updated = Date.now();
	next();
});

module.exports = mongoose.model('Engine', Engine);