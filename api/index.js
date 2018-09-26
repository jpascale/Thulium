const bodyParser = require('body-parser')
    , express = require('express');

const app = express();
app.use(bodyParser.json())

app.use(require('./core/'));

app.listen(3000, () => {
  console.log('🚀 App listening on port 3000. Press Ctrl ^C to exit...');
});
