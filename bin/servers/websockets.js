const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4001 })

const makeId = (function() {
  let id = 0
  return () => id++
})()

wss.on('connection', function connection(ws) {
  const clientId = makeId()
  const format = (data) => JSON.stringify([clientId, ...data])
  const formatAndLog = (data) => {
    const formatted = format(data);
    console.log(formatted);
    return formatted;
  }

  function sendEach(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    })
  }

  function sendNConnections() {
    sendEach(formatAndLog(['ws', 'n', wss.clients.size]))
  }

  // on 'connection'
  ws.send(formatAndLog(['ws', 'connected']));
  sendNConnections()

  ws.on('message', function incoming(data) {
    console.log(data)
    sendEach(data)
  });

  ws.on('close', function close() {
    ws.send(formatAndLog(['ws', 'closed']));
    sendNConnections()
  });
});
