const express = require('express')
  , router = express.Router({ mergeParams: true })
  , { User, Dataset } = require('@thulium/internal')
  , Status = require('http-status-codes')
  , { PostgresStorage } = require('@thulium/storage')
  , async = require('async')
  , validateUser = require('../../../middleware/validateUser')
  , debug = require('debug')('api:core:v1:session')
  , crypto = require('crypto');

const hash = (data) => crypto.createHash('md5').update(data).digest("hex");

router.post('/',
  validateUser,
  (req, res, next) => {
    const { paradigm, title, items } = req.body;
    debug({ paradigm, title });
    debug(items);
    Dataset.create({ paradigm, title, items, userId: req.user.sub }, (err, dataset) => {
      if (err) {
        console.error(err);
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
      }
      debug('created internal dataset');
      res.status(Status.OK).json({ ok: 1 });
    });
  }
);

router.post('/datasets',
  validateUser,
  (req, res) => {
    Dataset.find({ publisher: req.user.sub }, (err, response) => {
      if (err) {
        console.error(err);
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
      }
      res.status(Status.OK).json(response);
    });
  });

// TODO: Check auth
// Deprecated
router.post('/create', (req, res, next) => {
  //TODO: check teacher role
  next();
}, (req, res) => {

  const { data: csvData } = req.body;

  if (!csvData) {
    return res.status(Status.BAD_REQUEST).json({ ok: 0 });
  }

  const headers = csvData.shift();

  PostgresStorage.createDataset({
    headers,
    data: csvData
  }, (err, tableName) => {
    if (err) {
      console.error(err);
      return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
    }
    return res.status(Status.CREATED).json({ tableName });
  });
});

module.exports = router;