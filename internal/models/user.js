const mongoose = require('mongoose');

const User = mongoose.Schema({
  
  /**
   * Users email
   */
  email: {
    type: String,
    // lowercase: true,
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

  first_name: {
    type: String
  },
  last_name: {
    type: String
  },

  /**
   * Blackboard stuff
   */

  bb_id: {
    type: String
  },
  bb_username: {
    type: String
  },
  bb_access_token: {
    type: String
  },
  bb_refresh_token: {
    type: String
  },
  bb_token_expiry: {
    type: Date
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