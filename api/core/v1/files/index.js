const express = require('express')
    , router = express.Router({ mergeParams: true })
		, Status = require('http-status-codes')
		, { File } = require('@thulium/internal')
		, debug = require('debug')('api:core:v1:files')
		, validateUser = require('../../../middleware/validateUser');

debug('setting up /core/v1/files routes');

router.post('/',
	validateUser,
	(req, res) => {
		const file = new File({
			owner: req.user.sub,
			...req.body /// TODO: this is unsafe
		});
		file.save(err => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}
			res.status(Status.CREATED).json(file.dto());
		});
	}
);

module.exports = router;