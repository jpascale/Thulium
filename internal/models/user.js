const mongoose = require('mongoose');

const User = mongoose.Schema({
  
  /**
   * Users email
   */
  email: {
    type: String,
    lowercase: true,
    // unique: true,
    // required: [true, "can't be blank"],
    // match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true
  },
  /**
   * Users role. one of [student, teacher, admin, anonymous]
   */
  role: {
    type: String
  },



  
  /**
   * Authentication stuff
   */
  hash: {
    type: String
  },
  salt: {
    type: String
  }
});

module.exports = User;