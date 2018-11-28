const express = require('express')
	, router = express.Router({ mergeParams: true })
	, debug = require('debug')('api:core:v1');

debug('setting up /core/v1 routes');

router.use('/postgres', require('./postgres'));
// router.use('/websocket', require('./websocket'));
router.use('/session', require('./session'));
router.use('/auth', require('./auth'));
router.use('/engines', require('./engines'));
router.use('/files', require('./files'));
router.use('/dataset', require('./dataset'));

module.exports = router;