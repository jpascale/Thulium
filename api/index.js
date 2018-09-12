const PostgresStorage = require('@thulium/storage').PostgresStorage;
const config = require('@thulium/base').config;

const express = require('express');
const app = express();

const os = require('os');

app.get('/test', async (req, res) => {
  const test = new PostgresStorage();
  await test.connect();
  const response = await test.query('CREATE TABLE testtable (name varchar(80), asd int);');
  return res.send({ service: 'api', hostname: os.hostname(), response });
});

app.get('/test2', async (req, res) => {
  return res.send(config);
});

app.listen(3000);
console.log('App listening on port 3000. Press Ctrl ^C to exit...');