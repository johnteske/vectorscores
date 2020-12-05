module.exports = process.env.WEBSOCKETS
  ? () => `
<div>
  <h4>WebSocket connection</h4>
  <p id="ws-log"></p>
</div>`
  : () => `<div><h4>WebSocket not enabled</h4></div>`;
