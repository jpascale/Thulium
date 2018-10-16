const userModel = require('../models/users')
  , jwt = require('jsonwebtoken'),
  { config } = require('@thulium/base');

module.exports = {
  create: function (req, res, next) {
    userModel.create({ username: req.body.username, email: req.body.email, hash: req.body.password }, function (err, result) {
      if (err) {
        return next(err);
      }
      return res.json({ status: "OK", message: "User successfully created.", data: null });
    });
  },

  authenticate: function (req, res, next) {
    userModel.findOne({ username: req.body.username }, function (err, user) {
      if (err) {
        return next(err);
      }

      if (user.validPassword(req.body.password)) {
        const authJSON = user.toAuthJSON();
        res.json({ status: "OK", message: "Successfully authenticated.", data: authJSON });
      } else {
        res.json({ status: "Error", message: "Invalid username/password.", data: null });
      }

    });
  },

}