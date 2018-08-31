const PostgresStorage = require('@thulium/storage').PostgresStorage;

const express = require('express');
const app = express();
const os = require('os');

app.get('/status', (req, res) => {
  const test = new PostgresStorage();
  return res.send({ service: 'api', hostname: os.hostname() });
});

app.listen(3000);
console.log('App listening on port 3000. Press Ctrl ^C to exit...');