const express = require('express')
    , router = express.Router({ mergeParams: true })
    , os = require('os')
    , Status = require('http-status-codes')
    , { PostgresStorage } = require('@thulium/storage')
    , { config } = require('@thulium/base');

router.post('/query', (req, res) => {
  const storage = new PostgresStorage({});
  storage.connect().then(() => {
    storage.query(req.body.query, (error, response) => {
      if (err) {
        return res.status(Status.BAD_REQUEST).json({ error });
      }
      res.status(Status.OK).json(response);
    });
  });
});

router.get('/test', async (req, res) => {
  const test = new PostgresStorage({});
  await test.connect();
  const response = await test.query('CREATE TABLE testtable (name varchar(80), asd int);');
  return res.status(Status.OK).json({ service: 'api', hostname: os.hostname(), response });
});

router.get('/test2', async (req, res) => {
  return res.status(Status.OK).json(config);
});

module.exports = router;