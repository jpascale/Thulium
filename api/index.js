const PostgresStorage = require('@thulium/storage').PostgresStorage;
const config = require('@thulium/base').config;
const bodyParser = require('body-parser');
const express = require('express');
const os = require('os');

const app = express();
app.use(bodyParser.json())

app.post('/query', (req, res) => {
  const storage = new PostgresStorage({});
  storage.connect().then(() => {
    storage.query(req.body.query, (err, response) => {
      if (err) {
        return res.send({ body: err })
      }
      res.send(response);
    });
  });
});

app.get('/test', async (req, res) => {
  const test = new PostgresStorage({});
  await test.connect();
  const response = await test.query('CREATE TABLE testtable (name varchar(80), asd int);');
  return res.send({ service: 'api', hostname: os.hostname(), response });
});

app.get('/test2', async (req, res) => {
  return res.send(config);
});

app.listen(3000);
console.log('App listening on port 3000. Press Ctrl ^C to exit...');