const requireRoot = require("app-root-path").require;

const websocketsSettings = requireRoot(
  "./assets/modules/settings/websockets.11ty.js"
);

module.exports = {
  layout: "movement",
  composer: "John Teske",
  options: websocketsSettings(),
  modules: ["websockets"]
};
