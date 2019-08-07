const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4001 })

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send(JSON.stringify(['client_id', 'ws', 'connected']));
});
