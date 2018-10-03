const express = require('express')
    , router = express.Router({ mergeParams: true })
    , os = require('os')
    , Status = require('http-status-codes')
    , { PostgresStorage: storage } = require('@thulium/storage')
    , debug = require('debug')('api:core:v1:postgres');

debug('setting up /core/v1/postgres routes');

router.post('/query', (req, res) => {
  storage.query(req.body.query, (err, response) => {
    if (err) {
      return res.status(Status.BAD_REQUEST).json({ error: err });
    }
    res.status(Status.OK).json(response);
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