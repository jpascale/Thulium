const express = require('express')
    , router = express.Router({ mergeParams: true })
    , Status = require('http-status-codes')
    , debug = require('debug')('api:core:v1:session')
    , jwt = require('jsonwebtoken')
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
    Session.findOrCreateById(req.params.id, { owner: req.user.db._id }, (err, session, found) => {
      if (err) {
        console.error(err);
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
      }

      // TODO: replace with configuration
      res.set('Location', `ws://127.0.0.1:${PORT}/${session._id}`);

      session.token = req.user.token;
      
      if (found) return res.status(Status.OK).json(session);
      res.status(Status.CREATED).json(session);
    });
  }
];

router.post('/hello', isUserValid, handleSessionHello);
router.post('/hello/:id([a-f0-9]+)', isUserValid, handleSessionHello);

module.exports = router;