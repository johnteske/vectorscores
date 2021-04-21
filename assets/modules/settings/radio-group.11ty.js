const requireRoot = require("app-root-path").require;
const { catMap } = require("eleventy-lib");

module.exports = (name, pairs) => `
<div class="settings-group">
  ${catMap(
    ({ label, value }) => `
    <label><input type="radio" name="${name}" value="${value}"> ${label}</label>
  `,
    pairs
  )}
</div>`;
