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

router.patch('/:id([0-9a-f]+)',
	validateUser,
	(req, res, next) => {
		debug(`[${req.params.id}] finding file`);
		File.findById(req.params.id, (err, file) => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}
			if (!file) return res.status(Status.NOT_FOUND).json({ code: 'NOT_FOUND' });
			debug(`[${req.params.id}] found file`);
			req.file = file;
			next();
		});
	},
	(req, res) => {
		const { content, title } = req.body;
		if (content) {
			req.file.content = content;
		}
		if (title) {
			req.file.title = title;
		}
		debug(`[${req.params.id}] saving`);
		req.file.save((err) => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}
			debug(`[${req.params.id}] saved`);
			return res.status(Status.OK).json(req.file.dto());
		});
	}
);

module.exports = router;