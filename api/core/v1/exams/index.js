const express = require('express')
	, router = express.Router({ mergeParams: true })
	, { Exam, Session, File, Job, ExamResponse } = require('@thulium/internal')
	, Status = require('http-status-codes')
	, validateUser = require('../../../middleware/validateUser')
	, debug = require('debug')('api:core:v1:exams')
	, async = require('async')
	, { mq: _mq } = require('@thulium/jobs');

const mq = _mq('push');

const uniqBy = (arr, predicate) => {
	const cb = typeof predicate === 'function' ? predicate : (o) => o[predicate];
	return [...arr.reduce((map, item) => {
		const key = (item === null || item === undefined) ? item : cb(item);
		
		map.has(key) || map.set(key, item);
		
		return map;
	}, new Map()).values()];
};

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
			if (!session.old) {
				File.find({ _id: { $in: session.files } }).exec((err, files) => {
					if (err) {
						console.error(err);
						return;
					}
					const jobs = files.map(f => ({
						key: mq.KEYS.CREATE_DATASET_INSTANCE,
						params: {
							dataset: f.dataset,
							engine: f.engine,
							owner: req.user.sub,
						},
						scope: []
					}));
		
					Job.insertMany(jobs, (err, jobs) => {
						if (err) return cb(err);
						jobs.forEach(job => {
							mq.createDatasetInstance(job._id);
						});
					});
				});
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

				const uid = q => `${q.dataset.toString()}|${q.engine}`;
				const jobs = uniqBy(req.exam.questions, uid).map(q => ({
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
			next();
		});
	},
	(req, res) => {
		ExamResponse.create({
			exam: req.params.eid,
			user: req.user.sub,
			question: req.params.qid,
			file: req.body.file,
			response: req.body.response,
		}, (err, response) => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}
			Job.create({
				key: mq.KEYS.COMPARE_WITH_REDUCED,
				params: {
					file: response.file,
					response: response._id,
					question: response.question,
					owner: req.user.sub,
					exam: response.exam
				},
				scope: []
			}, (err, job) => {
				if (err) {
					console.error(err);
					return;
				}
				mq.compareWithReduced(job._id);
			});
			res.status(Status.CREATED).json(response);
		});

		
	}
);

router.get('/:id([a-f0-9]+)/responses',
	validateUser,
	(req, res, next) => {
		async.parallel({
			exam: cb => {
				Exam.findById(req.params.id).exec(cb);
			},
			responses: cb => {
				ExamResponse.find({
					exam: req.params.id
				})
				.populate({
					path: 'user',
					select: 'email first_name last_name bb_id'
				})
				.exec(cb)
			}
		}, (err, results) => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}
			res.status(Status.OK).json(results);
		});
	}
);

router.patch('/:id([a-f0-9]+)/review',
	validateUser,
	(req, res, next) => {
		ExamResponse.findById(req.params.id).exec((err, response) => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}
			if (!response) {
				return res.status(Status.NOT_FOUND).json({ ok: 0 });
			}
			req.examResponse = response;
			next();
		});
	},
	(req, res) => {
		req.examResponse.review = req.body.review;
		req.examResponse.save(err => {
			if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
			}
			res.status(Status.OK).json(req.response);
		});
	}
);

module.exports = router;
