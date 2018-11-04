const mongoose = require('mongoose')
  , uniqueValidator = require('mongoose-unique-validator')
  , crypto = require('crypto')
	, jwt = require('jsonwebtoken')
	, { User } = require('../models')
  , debug = require('debug')('internal:controllers:user')
  , { Config } = require('@thulium/base')
  , omit = require('lodash/omit');
  
debug('setting up user controller');

User.pre('save', function (next) {
  const self = this;
  if (!self.isNew) return next();
  self.salt = crypto.randomBytes(16).toString('hex');
  crypto.pbkdf2(this.hash, this.salt, 10000, 512, 'sha512', (err, derivedKey) => {
    if (err) return next(err);
    self.hash = derivedKey.toString('hex');
    next();
  });
});

User.methods.changePassword = function (password, cb) {
  const self = this;
  self.salt = crypto.randomBytes(16).toString('hex');
  crypto.pbkdf2(password, this.salt, 10000, 512, 'sha512', (err, derivedKey) => {
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

User.methods.generateJWT = function (cb) {
  const self = this;
  const expiresIn = ((role) => {
    if (role === 'anonymous') return '1d';
    return '7d';
  })(self.role);
  jwt.sign({ role: self.role }, config.secret, Object.assign({}, Config.jwt, {
    expiresIn,
    subject: self._id
  }), cb);
};

User.methods.dto = function () {
  return omit(this, 'password', 'hash');
};

User.plugin(uniqueValidator, { message: 'is already taken.' });

module.exports = mongoose.model('User', User);