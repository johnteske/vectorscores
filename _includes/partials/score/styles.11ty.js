const requireRoot = require("app-root-path").require;
const { maybe, url } = require("eleventy-lib");
const { forEachModuleWithFile } = requireRoot(
  "render-utils.js"
);

module.exports = data => ` 
  <link rel="stylesheet" href="${url.asset(data.site.baseUrl, "/css/score.css")}">
  ${maybe(
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
