const bodyParser = require('body-parser')
    , express = require('express')
    , http = require('http')
    , { PostgresStorage } = require('@thulium/storage')
    , { config } = require('@thulium/base')
    , debug = require('debug')('api')
    , { createThuliumWebSocketServer } = require('@thulium/ws')
    , Status = require('http-status-codes');

debug('setting up postgres config');
PostgresStorage.config(config.postgres);

const app = express();
debug('setting up middleware');
app.use(bodyParser.json());

debug('setting up routes');
app.use('/core', require('./core/'));

app.use((req, res) => {
  res.status(Status.NOT_FOUND).send();
});

debug('creating http server');
const server = http.createServer(app);

debug('setting up web socket server');
const wss = createThuliumWebSocketServer(server);

const PORT = process.env.PORT || 3000;
debug('start up server');
server.listen(PORT, () => {
  console.log(`🚀 App listening on port ${PORT}. Press Ctrl ^C to exit...`);
});
