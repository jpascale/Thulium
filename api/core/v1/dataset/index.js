const express = require('express')
  , router = express.Router({ mergeParams: true })
  , { User } = require('@thulium/internal')
  , Status = require('http-status-codes')
  , { PostgresStorage: storage } = require('@thulium/storage')
  , async = require('async')
  , validateUser = require('../../../middleware/validateUser')
  , crypto = require('crypto');

const hash = (data) => crypto.createHash('md5').update(data).digest("hex");

//TODO: Check auth
router.post('/create', (req, res, next) => {
  //TODO: check teacher role
  next();
}, (req, res) => {

  const { data } = req.body;

  if (!data) {
    return res.status(Status.BAD_REQUEST).send({ status: 'error' });
  }

  const fields = data.shift();
  const datasetName = hash(new Buffer(data)).replace(/[0-9]/g, '');

  const postgresInsert = (fields, data) => (cb) => {
    const amount = fields.length;
    const fieldStr = fields.map(str => `${str} VARCHAR(100)`).join(', ');
    const createStr = `CREATE TABLE ${datasetName} (${fieldStr});`;

    storage.query(createStr, (err, response) => {
      if (err) {
        console.error(err);
        return res.status(Status.BAD_REQUEST).json({ error: err });
      }

      const q = {
        datasetName,
        insertType: `(${fields.join(', ')})`
      };

      async.eachLimit(data, 1000, (elem, cb) => {
        if (elem.length < amount) {
          return cb();
        }

        const insertQuery = `INSERT INTO ${q.datasetName}${q.insertType} VALUES (${elem.map(str => `'${str}'`).join(',')});`;

        storage.query(insertQuery, (err, response) => {
          if (err) {
            console.error(err);
          }
          cb();
        })
      }, (err) => {
        if (err) {
          console.error(err);
          cb();
        }

        cb()
      });

    });
  }
  // insertPostgres(fields, data)(console.log);

  async.series([
    postgresInsert(fields, data)
  ], (err) => {
    if (err) {
      console.error(err);
      return res.status(Status.INTERNAL_SERVER_ERROR).send(err);
    }
    return res.status(Status.OK).send({ status: 'ok', dataset_name: datasetName });
  });

});

module.exports = router;