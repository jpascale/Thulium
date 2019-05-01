const mongoose = require('mongoose')
  , debug = require('debug')('internal:models:exam-response');

debug('configuring exam response');

/**
 * Note: This schema will be both used for "the correct response"
 * and for the user's response.
 */

const ExamResponse = mongoose.Schema({
  task: {
    type: String,
  },
  type: {
    type: String,
    lowercase: true,
    /**
     * tf: True or False,
     * mc: Multiple choice
     * wa: Written answer
     * qr: Query response
     */
    enum: ['tf', 'mc', 'wa', 'qr']
  },
  // Maybe we should support an array of datasets?
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam'
  },
  // If this is a correct answer, this field can be filled with the owner or left empty
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamQuestion'
  },
  /** This field should be filled with:
   *  - 'true' or 'false' if type is tf
   *  - A letter (a, b, c, etc) if type is mc
   *  - Text if type is wa
   *  - A query if type is qr
  */
  response: {
    type: String,
  }
});

module.exports = ExamReponse;
