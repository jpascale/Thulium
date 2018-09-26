const express = require('express')
		, router = express.Router({ mergeParams: true });

app.use('/postgres', require('./postgres'));

module.exports = router;