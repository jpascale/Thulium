const mongoose = require('mongoose')
		, debug = require('debug')('internal:models:engine');

debug('configuring engine schema');

const Engine = mongoose.Schema({
	title: {
		type: String
	},
	/// other meta information
});

module.exports = Engine;