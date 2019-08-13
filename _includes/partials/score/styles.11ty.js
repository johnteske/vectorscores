const requireRoot = require("app-root-path").require;
const { assetsUrl, forEachModuleWithFile, maybeTemplate } = requireRoot(
  "render-utils.js"
);

module.exports = data => ` 
  <link rel="stylesheet" href="${assetsUrl(data.site, "/css/score.css")}">
  ${maybeTemplate(
    `<link rel="stylesheet" href="../styles.css">`,
    data.layout === "movement"
  )}
  ${forEachModuleWithFile(
    "styles.css",
    path => `<link rel="stylesheet" href="${path}">`,
    data
  )}
  <link rel="stylesheet" href="styles.css">
 `;
