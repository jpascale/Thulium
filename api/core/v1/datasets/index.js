const express = require('express')
  , router = express.Router({ mergeParams: true })
  , { DatasetInstance, Dataset } = require('@thulium/internal')
  , Status = require('http-status-codes')
  , { PostgresStorage } = require('@thulium/storage')
  , async = require('async')
  , validateUser = require('../../../middleware/validateUser')
  , debug = require('debug')('api:core:v1:datasets')
  , crypto = require('crypto');

const hash = (data) => crypto.createHash('md5').update(data).digest("hex");

/**
 * Create dataset
 */
router.post('/',
  validateUser,
  (req, res, next) => {
    const { paradigm, title, items, exam, actions } = req.body;
    debug({ paradigm, title, exam, actions });
    debug(items);
    Dataset.create({ paradigm, title, exam, items, userId: req.user.sub, actions }, (err, dataset) => {
      if (err) {
        console.error(err);
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
      }
      debug('created internal dataset');
      res.status(Status.OK).json(dataset);
    });
  }
);

/**
 * Retrieve all the datasets
 */
router.get('/all',
  validateUser,
  (req, res) => {
    Dataset.find({}, (err, response) => {
      if (err) {
        console.error(err);
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
      }
      res.status(Status.OK).json(response);
    });
  }
);


/**
 * Retrieve user datasets;
 */
router.get('/datasets',
  validateUser,
  (req, res) => {
    Dataset.find({ publisher: req.user.sub }, (err, response) => {
      if (err) {
        console.error(err);
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
      }
      res.status(Status.OK).json(response);
    });
  }
);


/**
 * Retrieve user instances
 */
router.get('/instances',
  validateUser,
  (req, res) => {
    DatasetInstance.find({ owner: req.user.sub }, (err, response) => {
      if (err) {
        console.error(err);
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
      }
      res.status(Status.OK).json(response);
    });
  });



// Deprecated_______________________________________________________________________________--
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
