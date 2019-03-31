const mongoose = require('mongoose')
  , uniqueValidator = require('mongoose-unique-validator')
  , crypto = require('crypto')
  , jwt = require('jsonwebtoken')
  , { User } = require('../models')
  , debug = require('debug')('internal:controllers:user')
  , { Config } = require('@thulium/base')
  , omit = require('lodash/omit')
  , async = require('async');

debug('setting up user controller');

// User.pre('save', function (next) {
//   const self = this;
//   if (!self.isNew || self.role === 'anonymous') return next();
//   self.salt = crypto.randomBytes(16).toString('hex');
//   crypto.pbkdf2(this.hash, this.salt, 10000, 512, 'sha512', (err, derivedKey) => {
//     if (err) return next(err);
//     self.hash = derivedKey.toString('hex');
//     next();
//   });
// });

User.methods.changePassword = function (password, cb) {
  const self = this;
  self.salt = crypto.randomBytes(16).toString('hex');
  crypto.pbkdf2(password, self.salt, 10000, 512, 'sha512', (err, derivedKey) => {
    if (err) return cb(err);
    self.hash = derivedKey.toString('hex');
    cb();
  });
};

User.methods.comparePassword = function (password, cb) {
  const self = this;
  crypto.pbkdf2(password, this.salt, 10000, 512, 'sha512', (err, derivedKey) => {
    if (err) return cb(err);
    const hash = derivedKey.toString('hex');
    cb(null, hash === self.hash);
  });
};

User.methods.generateJWT = function (data, cb) {
  if (typeof data === 'function') {
    cb = data;
    data = undefined;
  }
  const self = this;
  const expiresIn = ((role) => {
    if (role === 'anonymous') return '1d';
    return '7d';
  })(self.role);
  const payload = Object.assign({}, { role: self.role }, data);
  const jwtOptions = Object.assign({}, Config.jwt, {
    expiresIn,
    subject: self._id.toString()
  });
  jwt.sign(payload, Config.secret, jwtOptions, cb);
};

User.methods.dto = function () {
  return omit(this.toObject(), 'password', 'hash', '__v', 'salt', 'created', 'last_updated');
};

User.statics.findOrCreateAnonymous = function (id, done) {
  const self = this;
  async.waterfall([
    cb => self.findById(id).exec(cb),
    (user, cb) => {
      if (user) return cb(null, user);
      self.create({ role: 'anonymous' }, cb);
    }
  ], done);
};

User.plugin(uniqueValidator, { message: 'is already taken.' });

module.exports = mongoose.model('User', User);