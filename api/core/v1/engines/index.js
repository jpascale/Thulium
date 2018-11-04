const express = require('express')
    , router = express.Router({ mergeParams: true })
		, Status = require('http-status-codes')
		, { Engine } = require('@thulium/internal')
		, debug = require('debug')('api:core:v1:engines')
		, validateUser = require('../../../middleware/validateUser');

debug('setting up /core/v1/engines routes');

router.get('/',
	validateUser,
	(req, res) => {
		Engine.find().select('title slug').exec((err, engines) => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}
			res.status(Status.OK).json(engines);
		});
	}
);

router.get('/:id([a-f0-9]+)',
	validateUser,
	(req, res) => {
		Engine.findById(req.params.id).select('title slug').exec((err, engine) => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}
			if (!engine) return res.status(Status.NOT_FOUND).json({ ok: 0 });
			res.status(Status.OK).json(engine);
		});
	}
);

module.exports = router;