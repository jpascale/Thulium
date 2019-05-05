const express = require('express')
  , router = express.Router({ mergeParams: true })
  , { Exam, Session, File } = require('@thulium/internal')
  , Status = require('http-status-codes')
  , validateUser = require('../../../middleware/validateUser')
  , debug = require('debug')('api:core:v1:exams')
  , async = require('async');

/**
 * Create exams
 */
router.post('/:id([a-f0-9]+)/load',
  validateUser,
  (req, res, next) => {
    async.parallel({
      session: cb => Session.findOrCreateByOwner(req.user.sub, cb),
      exam: cb => Exam.findById(req.params.id, cb),
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
    req._session.examFiles = [];
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
    let i = 1;
    async.map(req.exam.questions, (question, cb) => {
      File.create({
        examFile: true,
        owner: req.user.sub,
        engine: question.engine,
        dataset: question.dataset,
        session: req._session._id,
        title: `Question #${i++}`
      }, cb)
    }, (err, files) => {
      if (err) {
				console.error(err);
				return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
      }
      debug(files);
      const response = req._session.dto();
      debug(response);
      response.files = files.map(f => f.dto());
      debug(response);

      res.status(Status.OK).json(response);
    });
  }
);

module.exports = router;
