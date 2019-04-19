const crypto = require('crypto');

const generateId = (key, ids) => {
  const auxKey = ids.join('|||||');
  const mainKey = [key, auxKey].join('|||||');
  const shasum = crypto.createHash('md5');
  shasum.update(mainKey);
  return shasum.digest('hex');
};

module.exports = {
  generateId
};