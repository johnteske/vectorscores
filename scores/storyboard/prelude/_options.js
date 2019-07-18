const requireRoot = require("app-root-path").require;

const pitchClasses = requireRoot(
  "./assets/modules/settings/pitch-classes/index.11ty.js"
);

const transposition = requireRoot(
  "./assets/modules/settings/transposition.11ty.js"
);

const generateButton = requireRoot(
  "./assets/modules/settings/generate-button.11ty.js"
);

module.exports = () => `
<form class="score-options">
  ${pitchClasses()}
  ${transposition()}
  ${generateButton()}
</form>`
