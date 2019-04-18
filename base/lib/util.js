const crypto = require('crypto');

class Util {

  generateId(key, ids) {
    const auxKey = ids.join('|||||');
    const mainKey = [key, auxKey].join('|||||');
    const shasum = crypto.createHash('md5');
    shasum.update(mainKey);
    return shasum.digest('hex');
  }

}

export default new Util();