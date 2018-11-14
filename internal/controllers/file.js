const mongoose = require('mongoose')
		, debug = require('debug')('internal:controllers:file')
		, { File } = require('../models')
		, omit = require('lodash/omit')
		, async = require('async');

debug('setting up file controller');

File.pre('save', function (next) {
	this.last_updated = Date.now();
	next();
});

File.pre('save', function (next) {
	const self = this;
	if (!self.isNew) return next();

	async.waterfall([
		cb => self.model('Session').findById(self.session, cb),
		(session, cb) => {
			session.files.push(self._id);
			session.markModified('files');
			session.save(cb)
		}
	], next);
})

File.methods.dto = function () {
	return omit(this.toObject(), '__v', 'created', 'last_updated');
};

module.exports = mongoose.model('File', File);