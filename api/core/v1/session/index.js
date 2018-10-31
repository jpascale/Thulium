const express = require('express')
    , router = express.Router({ mergeParams: true })
    , os = require('os')
    , Status = require('http-status-codes')
    , { PostgresStorage: storage } = require('@thulium/storage')
    , debug = require('debug')('api:core:v1:session');

debug('setting up /core/v1/session routes');

const PORT = process.env.PORT || 3000;

router.post('/hello', (req, res) => {

  // find or create session

  res.set('Location', `ws://${os.hostname()}:${PORT}/`);

  if (/* session.isNew */ Math.random() > 0.5) {
    return res.status(Status.CREATED).json({
      files: []
    });
  }
  res.status(Status.OK).json({
    files: []
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