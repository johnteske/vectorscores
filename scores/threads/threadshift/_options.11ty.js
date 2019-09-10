const requireRoot = require("app-root-path").require;

const websocketsSettings = requireRoot(
  "./assets/modules/settings/websockets.11ty.js"
);

module.exports = () => websocketsSettings();
