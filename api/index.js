const bodyParser = require('body-parser')
  , express = require('express')
  , { PostgresStorage, MongoStorage } = require('@thulium/storage')
  , { config } = require('@thulium/base')
  , debug = require('debug')('api');

debug('setting up postgres config');
PostgresStorage.config(config.postgres);

debug('setting up mongo config for users')
MongoStorage.config(config.mongo.users);

const app = express();
debug('setting up middleware');
app.use(bodyParser.json());

debug('setting up routes');
app.use('/core', require('./core/'));


const PORT = process.env.PORT || 3000;
debug('start up server');
app.listen(PORT, () => {
  console.log('🚀 App listening on port 3000. Press Ctrl ^C to exit...');
});
