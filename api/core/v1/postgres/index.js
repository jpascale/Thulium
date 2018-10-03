const express = require('express'),
  router = express.Router({ mergeParams: true }),
  os = require('os'),
  Status = require('http-status-codes'),
  { postgresStorage } = require('../../../entrypoint');

router.post('/query', (req, res) => {
  postgresStorage.connect().then(() => {
    postgresStorage.query(req.body.query, (err, response) => {
      if (err) {
        return res.status(Status.BAD_REQUEST).json({ error });
      }
      res.status(Status.OK).json(response);
    });
  });
});

router.get('/test', async (req, res) => {
  await postgresStorage.connect();
  const response = await postgresStorage.query('CREATE TABLE testtable (name varchar(80), asd int);');
  return res.status(Status.OK).json({ service: 'api', hostname: os.hostname(), response });
});

router.get('/test2', async (req, res) => {
  return res.status(Status.OK);
});

module.exports = router;