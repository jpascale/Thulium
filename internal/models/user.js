const mongoose = require('mongoose');

const User = mongoose.Schema({
  /**
   * Users username
   */
  username: {
    type: String,
    lowercase: true,
    // unique: true,
    // required: [true, "can't be blank"],
    // match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    index: true
  },
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