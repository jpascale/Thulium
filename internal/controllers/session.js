const mongoose = require('mongoose')
	, debug = require('debug')('internal:controllers:session')
	, { Session } = require('../models')
	, File = require('./file')
	, Engine = require('./engine')
	, Dataset = require('./dataset')
	, async = require('async')
	, omit = require('lodash/omit')
	, { Config } = require('@thulium/base');

debug('setting up session controller');

Session.pre('save', function (next) {
	this.last_updated = Date.now();
	next();
});

Session.pre('save', function (next) {
	const self = this;
	if (!self.isNew) return next();

	async.waterfall([
		cb => Dataset.findOne({ default: true }, cb),
		(dataset, cb) => {
			const file = new File({
				owner: self.owner,
				title: 'New File',
				session: self._id,
				dataset: dataset._id
			});
		
			file.isDefaultFile = true;
			file.engine = Config.defaultEngine;
		
			file.save(cb);
		}
	], (err, file) => {
		if (err) return next(err);
		self.files = [file._id];
		next();
	});
	
});

Session.statics.findOrCreateById = function (id, { owner }, done) {
	const self = this;
	async.waterfall([
		cb => self.findById(id).exec(cb),
		(session, cb) => {
			if (session) return cb(null, session, true);
			const s = new self({ owner });
			s.save(err => cb(err, s, false));
		}
	], done);
};

Session.statics.findOrCreateByOwner = function (owner, done) {
	const self = this;
	async.waterfall([
		cb => self.findOne({ owner }).exec(cb),
		(session, cb) => {
			if (session) return cb(null, session);
			const s = new self({ owner });
			s.save(cb);
		}
	], done);
};

Session.methods.dto = function () {
	const self = this;
	const dto = self.toObject()
	if (self.populated('files')) {
		dto.files = self.files.map(file => file.dto());
	}
	return omit(dto, 'ws', '__v', 'created', 'last_updated');
}

module.exports = mongoose.model('Session', Session);