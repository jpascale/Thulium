const express = require('express')
	, router = express.Router({ mergeParams: true })
	, { Exam, Session, File, Dataset, Job } = require('@thulium/internal')
	, Status = require('http-status-codes')
	, validateUser = require('../../../middleware/validateUser')
	, debug = require('debug')('api:core:v1:exams')
	, async = require('async')
	, mq = require('../../../mq');
	
/**
 * Create exams
 */
router.post('/:id([a-f0-9]+)/load',
	validateUser,
	(req, res, next) => {
		async.parallel({
			session: cb => {
				debug('fetch or create session');
				Session.findOrCreateByOwner(req.user.sub, cb)
			},
			exam: cb => {
				debug('fetching exam');
				Exam.findById(req.params.id).exec(cb);
			},
		}, (err, { session, exam }) => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}
			if (!exam) {
				return res.status(Status.NOT_FOUND).send();
			}
			req._session = session;
			req.exam = exam;
			next();
		});
	},
	(req, res, next) => {
		debug('cleaning up session');
		req._session.examFiles = [];
		req._session.exam = req.exam._id;
		req._session.markModified('examFiles');
		req._session.save(err => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}
			next();
		});
	},
	(req, res, next) => {
		async.parallel({
			files: cb => {
				debug('creating files');
				let i = 1;
				async.map(req.exam.questions, (question, cb) => {
					File.create({
						examFile: true,
						owner: req.user.sub,
						engine: question.engine,
						dataset: question.dataset,
						session: req._session._id,
						title: `Question #${i++}`
					}, cb);
				}, cb);
			},
			instances: cb => {
				debug('creating instances');

				const jobs = req.exam.questions.map(q => ({
					key: mq.KEYS.CREATE_DATASET_INSTANCE,
					params: {
						dataset: q.dataset,
						engine: q.engine,
						owner: req.user.sub,
						exam: req.exam._id
					}
				}));

				Job.insertMany(jobs, (err, jobs) => {
					if (err) return cb(err);
					jobs.forEach(job => {
						mq.createDatasetInstance(job._id);
					});
					cb(null, jobs);
				});
			}
		}, (err, { files, instances }) => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}
			const response = req._session.dto();
			response.files = files.map(f => f.dto());

			debug(instances);

			res.status(Status.OK).json(response);
		});
	}
);

module.exports = router;
