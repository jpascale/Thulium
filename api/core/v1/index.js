const express = require('express')
		, router = express.Router({ mergeParams: true });

router.use('/postgres', require('./postgres'));

module.exports = router;