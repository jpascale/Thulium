const mongoose = require('mongoose')
		, debug = require('debug')('internal:controllers:session')
		, { Session } = require('../models')
		, async = require('async');

debug('setting up session controller');

Session.pre('save', function (next) {
	this.last_updated = Date.now();
	next();
});

Session.statics.findOrCreateById = function (id, { owner }, done) {
	const self = this;
	async.waterfall([
		cb => self.findById(id).exec(cb),
		(session, cb) => {
			if (session) return cb(null, session, true);
			const s = new self({ owner });
			s.save(cb);
		}
	], done);
};

module.exports = mongoose.model('Session', Session);