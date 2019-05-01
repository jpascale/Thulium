const crypto = require('crypto')
    , Config = require('./config');

const generateId = (key, ids) => {
  const auxKey = ids.join('|||||');
  const mainKey = [key, auxKey].join('|||||');
  const shasum = crypto.createHash('md5');
  shasum.update(mainKey);
  return shasum.digest('hex');
};

const verifyToken = (token, next) => jwt.verify(token, Config.secret, Config.jwt, next);

module.exports = {
  generateId,
  verifyToken
};