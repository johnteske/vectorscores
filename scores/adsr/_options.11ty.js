const requireRoot = require("app-root-path").require;

const generateButton = requireRoot(
  "./assets/modules/settings/generate-button.11ty.js"
);

const websocketsSettings = requireRoot(
  "./assets/modules/settings/websockets.11ty.js"
);

module.exports = () => `
<form class="score-options">
    <div class="settings-group">
        <label>Number of parts (1–16): <input type="number" min="1" max="16" name="parts"></label>
    </div>
    <div class="settings-group">
        <label>Show parameters on each measure: <input name="verbose" type="checkbox"></label>
    </div>
 </form>
 ${websocketsSettings()}
`;
