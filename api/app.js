const bodyParser = require('body-parser')
    , express = require('express')
    , http = require('http')
    , debug = require('debug')('api:app')
    , { createThuliumWebSocketServer } = require('@thulium/ws')
    , Status = require('http-status-codes')
    , { Session } = require('@thulium/internal');

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