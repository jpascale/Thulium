const express = require('express')
    , router = express.Router({ mergeParams: true })
    , os = require('os')
    , Status = require('http-status-codes')
    , debug = require('debug')('api:core:v1:postgres');

debug('setting up /core/v1/websocket routes');

const minPort = 8081;
const maxPort = 8090;
let port = minPort;

router.post('/new', (req, res) => {
  if (port > maxPort){
    port = minPort;
  }
  const response = {"success": "true", "data":{"socket_addr": "ws://"+ os.hostname()+":"+port+"/"}};
  port++;
  res.status(Status.OK).json(response);
});


router.get('/test', async (req, res) => {
  return res.status(Status.OK);
});

module.exports = router;