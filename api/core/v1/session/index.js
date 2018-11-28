const express = require('express')
    , router = express.Router({ mergeParams: true })
    , Status = require('http-status-codes')
    , debug = require('debug')('api:core:v1:session')
    , async = require('async')
    , { Session, User } = require("@thulium/internal")
    , { isUserValid } = require('../../../middleware/validateUser');

debug('setting up /core/v1/session routes');

const PORT = process.env.PORT || 3000;

const handleSessionHello = [
  (req, res, next) => {
    req.user = req.user || {};
    async.waterfall([
      cb => User.findOrCreateAnonymous(req.user.sub, cb),
      (user, cb) => {
        req.user.db = user;
        user.generateJWT(cb);
      }
    ], (err, token) => {
      if (err) {
        console.error(err);
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
      }
      req.user.token = token;
      next();
    });
  },
  (req, res) => {
    async.waterfall([
      cb => Session.findOrCreateById(req.params.id, { owner: req.user.db._id }, cb),
      (session, found, cb) => {
        session.populate({
          path: 'files',
          select: 'engine title content'
        }, (err) => {
          cb(err, session, found);
        });
      }
    ], (err, session, found) => {
      if (err) {
        console.error(err);
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
      }

      // TODO: replace with configuration
      res.set('Location', (() => {
        if (process.env.NODE_ENV === 'development') {
          return `ws://127.0.0.1:${PORT}/${session._id}`;
        }
        return `ws://thulium.xyz/${session._id}`;
      })());
      res.set('x-api-token', req.user.token);
      
      if (found) return res.status(Status.OK).json(session.dto());
      res.status(Status.CREATED).json(session.dto());
    });
  }
];

const isUserValidWrapper = (req, res, next) => isUserValid(req, res, err => next());

router.post('/hello', isUserValidWrapper, handleSessionHello);
router.post('/hello/:id([a-f0-9]+)', isUserValidWrapper, handleSessionHello);

module.exports = router;