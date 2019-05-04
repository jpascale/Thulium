const express = require('express')
  , router = express.Router({ mergeParams: true })
  , { Exam } = require('@thulium/internal')
  , Status = require('http-status-codes')
  , validateUser = require('../../../middleware/validateUser')
  , debug = require('debug')('api:core:v1:exams');

/**
 * Create exams
 */
router.post('/',
  validateUser,
  (req, res, next) => {
    const { title, contentId, gradeColumnId, questions } = req.body;
    debug({ title, contentId, gradeColumnId });
    debug(questions);

    Exam.create({ title, contentId, gradeColumnId, questions, userId: req.user.sub }, (err, exam) => {
      if (err) {
        console.error(err);
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ ok: 0 });
      }
      debug('created internal exam');
      res.status(Status.OK).json({ ok: 1 });
    });
  });

module.exports = router;
