const mongoose = require('mongoose')
    , debug = require('debug')('internal:controllers:exam')
    , async = require('async')
    , { Exam } = require('../models')
    // , ExamQuestion = require('./exam-question')
    // , ExamResponse = require('./exam-response');

debug('setting up exam controller');

// Exam.statics.create = function ({ title, contentId, gradeColumnId, questions, userId }, done) {
//     const self = this;

//     debug('Creating exam questions');
//     const persistableQuestions = questions.map(({ task, type, correct_answer }) => {
//         const persistableCorrectAnswer = new ExamResponse({
//             _id: mongoose.Types.ObjectId(),
//             type,
//             response: correct_answer.response
//         });
//         const question = new ExamQuestion({
//             _id: mongoose.Types.ObjectId(),
//             task,
//             type,
//             correct_answer: persistableCorrectAnswer._id
//         });
//         return question;
//     });

//     debug('creating exam');
//     const exam = new self({
//         title,
//         contentId,
//         gradeColumnId,
//         owner: userId,
//         questions: persistableQuestions,
//     });

//     exam.save(done);

// };

module.exports = mongoose.model('Exam', Exam);