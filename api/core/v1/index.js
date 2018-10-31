const express = require('express')
		, router = express.Router({ mergeParams: true })
		, debug = require('debug')('api:core:v1');

debug('setting up /core/v1 routes');

router.use('/postgres', require('./postgres'));
// router.use('/websocket', require('./websocket'));
router.use('/session', require('./session'));

module.exports = router;