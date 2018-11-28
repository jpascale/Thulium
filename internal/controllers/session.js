const mongoose = require('mongoose')
		, debug = require('debug')('internal:controllers:session')
		, { Session } = require('../models')
		, File = require('./file')
		, Engine = require('./engine')
		, async = require('async')
		, omit = require('lodash/omit')
		, { Config } =require('@thulium/base');

debug('setting up session controller');

Session.pre('save', function (next) {
	this.last_updated = Date.now();
	next();
});

Session.pre('save', function (next) {
	const self = this;
	if (!self.isNew) return next();

	const file = new File({
		owner: self.owner,
		title: 'New File',
		session: self._id,
	});

	file.isDefaultFile = true;

	async.waterfall([
		cb => Engine.findOne({ slug: Config.defaultEngine }, cb),
		(engine, cb) => {
			file.engine = engine._id;
			file.save(cb);
		}
	], (err) => {
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

Session.methods.dto = function () {
	const self = this;
	const dto = self.toObject()
	if (self.populated('files')) {
		dto.files = self.files.map(file => file.dto());
	}
	return omit(dto, '__v', 'created', 'last_updated');
}

module.exports = mongoose.model('Session', Session);