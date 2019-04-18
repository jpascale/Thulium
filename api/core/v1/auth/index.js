const express = require('express')
  , router = express.Router({ mergeParams: true })
  , { User } = require('@thulium/internal')
  , debug = require('debug')('api:core:v1:postgres')
  , Status = require('http-status-codes')
  , async = require('async')
  , crypto = require('crypto')
  , validateUser = require('../../../middleware/validateUser');

router.use('/social', require('./social/'));

router.post('/register',
  (req, res, next) => {
    debug(`Creating ${req.body.email}`);
    User.create({
      email: req.body.email,
      hash: req.body.password,
      role: req.body.role,
      salt: crypto.randomBytes(16).toString('hex')
    }, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
      }

      User.findOne({
        email: req.body.email
      }, (err, user) => {
        if (err) {
          console.error(err);
          return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
        }
        user.changePassword(req.body.password, (err) => {
          if (err) {
            console.error(err);
            return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
          }
          return res.status(Status.CREATED).json(user.dto());
        });
      });
    });
  }
);

router.post('/login',
  (req, res, next) => {
    User.findOne({
      email: req.body.email
    }, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
      }
      if (!user) {
        return res.status(Status.UNAUTHORIZED).json({ ok: 0, code: 'INVALID_USERNAME' });
      }
      req.user = user;
      next();
    })
  },
  (req, res, next) => {
    req.user.comparePassword(req.body.password, (err, match) => {
      if (err) {
        console.error(err);
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
      }
      if (!match) {
        return res.status(Status.UNAUTHORIZED).json({ ok: 0, code: 'INVALID_PASSWORD' });
      }
      next();
    })
  },
  (req, res, next) => {
    req.user.generateJWT((err, token) => {
      if (err) {
        console.error(err);
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
      }
      res.status(Status.OK).json({
        profile: req.user.dto(),
        token
      });
    });
  }
);

router.get('/profile',
  validateUser,
  (req, res, next) => {
    User.findById(req.user.sub).exec((err, user) => {
      if (err) {
        console.error(err);
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
      }
      if (!user) {
        return res.status(Status.UNAUTHORIZED).json({ ok: 0 });
      }
      res.status(Status.OK).json(user.dto());
    })
  }
);

module.exports = router;