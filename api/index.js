const bodyParser = require('body-parser')
    , express = require('express')
    , { PostgresStorage } = require('@thulium/storage')
    , { config } = require('@thulium/base');

PostgresStorage.config(config.postgres);

const app = express();
app.use(bodyParser.json());

app.use('/core', require('./core/'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('🚀 App listening on port 3000. Press Ctrl ^C to exit...');
});
