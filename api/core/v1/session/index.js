const express = require('express')
    , router = express.Router({ mergeParams: true })
    , os = require('os')
    , Status = require('http-status-codes')
    , { PostgresStorage: storage } = require('@thulium/storage')
    , debug = require('debug')('api:core:v1:session')
    , { Session } = require("@thulium/internal");

debug('setting up /core/v1/session routes');

const PORT = process.env.PORT || 3000;

router.post('/hello', (req, res) => {
  Session.findOrCreateById(null, {}, (err, session, found) => {
    if (err) {
      console.error(err);
      return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
    }

    // TODO: replace with configuration
    res.set('Location', `ws://127.0.0.1:${PORT}/${session._id}`);

    if (found) return res.status(Status.OK).json(session);
    res.status(Status.CREATED).json(session);
  });
});

router.get('/test', async (req, res) => {
  const response = await storage.query('CREATE TABLE testtable (name varchar(80), asd int);');
  return res.status(Status.OK).json({ service: 'api', hostname: os.hostname(), response });
});

router.get('/test2', async (req, res) => {
  return res.status(Status.OK);
});

module.exports = router;