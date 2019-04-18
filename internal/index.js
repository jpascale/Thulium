module.exports = require('./controllers');
// This if avoids connection to be run when running tests
// Important to test using a mongodb in-memory environment
if (process.env.NODE_ENV !== 'test') {
    module.exports.connect = require('./storage').connect;
    module.exports.connection = require('./storage').connection;
}
