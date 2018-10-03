const express = require('express')
  , router = express.Router({ mergeParams: true })
  , Status = require('http-status-codes');

if (process.env.NODE_ENV === 'development') {
  router.use((req, res, next) => {
    console.log(`${req.method} ${req.baseUrl}${req.path} %o %o`, req.query, req.body);
    next();
  });
}

router.use('/v:api_version([1-9]+)', (req, res, next) => {
  req.params.api_version = parseInt(req.params.api_version, 10);
  next();
});

router.use('/v1', require('./v1/'));

router.use('/v:api_version([1-9]+)', (req, res, next) => {
  res.status(Status.NOT_FOUND).json({
    message: `No such api version ${req.params.api_version}`
  });
});

module.exports = router;