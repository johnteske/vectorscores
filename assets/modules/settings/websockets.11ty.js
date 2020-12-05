module.exports = () => `
<div>
  <h4>WebSocket connection</h4>
  ${process.env.WEBSOCKETS ? '<p id="ws-log"></p>' : '<p>Not available</p>'}
</div>`
