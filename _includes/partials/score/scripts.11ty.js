const rootRequire = require("app-root-path").require;
const {
  url
} = require("eleventy-lib");
const {
  fileExists,
  forEachModuleWithFile
} = rootRequire("render-utils");

module.exports = data =>
  `<script src="${url.asset(
    data.site.baseUrl,
    "/js/lib/d3.v4.min.js"
  )}" charset="utf-8"></script>
    <script src="${url.asset(
      data.site.baseUrl,
      "/js/vectorscores.js"
    )}" charset="utf-8"></script>
    ${forEachModuleWithFile(
      "index.js",
      path => `<script src="${path}" charset="utf-8"></script>`,
      data
    )}`;
