const express = require('express')
  , router = express.Router({ mergeParams: true })
  , userController = require('./internal/controllers/user')
  , jwt = require('jsonwebtoken');

const validateUser = function (req, res, next) {
  jwt.verify(req.headers['x-access-token'], config.secret, function (err, decoded) {
    if (err) {
      res.json({ status: "error", message: err.message, data: null });
    } else {
      // add user id to request
      req.userId = decoded.id;
      next();
    }
  });
}

router.post('/register', userController.create);
router.post('/auth', userController.authenticate);

router.post('/test_auth_endpoint', validateUser, (req, res) => {
  return res.json({ status: "Ok", userId: req.userId })
})

module.exports = router;