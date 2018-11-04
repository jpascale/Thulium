const express = require('express')
  , router = express.Router({ mergeParams: true })
  , { User } = require('@thulium/internal')
  , debug = require('debug')('api:core:v1:postgres')
  , Status = require('http-status-codes')
  , async = require('async')
  , validateUser = require('../../../middleware/validateUser');

router.post('/register',
  (req, res, next) => {
    debug(`Creating ${req.body.username}`);
    User.create({
      username: req.body.username,
      email: req.body.email,
      hash: req.body.password
    }, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
      }
      return res.status(Status.CREATED).json(user.dto());
    });
  }
);

router.post('/login',
  (req, res, next) => {
    User.findOne({
      username: req.body.username
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