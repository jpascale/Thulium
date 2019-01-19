const crypto = require('crypto');
const generateTableName = data => crypto.createHash('md5').update(data).digest('hex');
module.exports = generateTableName;