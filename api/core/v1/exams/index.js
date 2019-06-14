const express = require('express')
	, router = express.Router({ mergeParams: true })
	, { Exam, Session, File, Job, ExamResponse } = require('@thulium/internal')
	, Status = require('http-status-codes')
	, validateUser = require('../../../middleware/validateUser')
	, debug = require('debug')('api:core:v1:exams')
	, async = require('async')
	, { mq } = require('@thulium/jobs');
	
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
				async.mapSeries(req.exam.questions, (question, cb) => {
					const file = new File({
						owner: req.user.sub,
						engine: question.engine,
						dataset: question.dataset,
						exam: req.exam._id,
						session: req._session._id,
						title: `Question #${i++}`
					});
					file.examFile = true;
					file.save(cb);
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
					},
					scope: req._session.ws
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
			response.files = files.map((f, i) => {
				const dto = f.dto();
				dto.task = req.exam.questions[i].content;
				dto.options = req.exam.questions[i].options;
				dto.question = req.exam.questions[i]._id;
				dto.type = req.exam.questions[i].type;
				return dto;
			});
			response.expect = instances.map(i => i._id);

			res.status(Status.OK).json(response);
		});
	}
);

router.post('/:eid([a-f0-9]+)/response/:qid([a-f0-9]+)',
	validateUser,
	(req, res, next) => {
		ExamResponse.findOne({
			exam: req.params.id,
			user: req.user.sub,
			question: req.params.qid
		}, (err, response) => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}
			if (response) {
				return res.status(Status.CONFLICT).json({
					ok: 0,
					code: 'ALREADY_SUBMITTED'
				});
			}
			req.response = response;
			next();
		});
	},
	(req, res) => {
		ExamResponse.create({
			exam: req.params.eid,
			user: req.user.sub,
			question: req.params.qid,
			response: req.body.response
		}, (err, response) => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}
			res.status(Status.CREATED).json(response);
		});
	}
)

module.exports = router;
