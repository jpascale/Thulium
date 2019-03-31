const express = require('express')
	, router = express.Router({ mergeParams: true });
	
router.use('/blackboard', require('./blackboard'));

module.exports = router;