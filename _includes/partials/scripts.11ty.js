const { catMap, url } = require("eleventy-lib");

module.exports = (data) => {
  const modules = data.modules || [];

  const sources = [
    // d3
    url.asset(data.site.baseUrl, "/js/d3.min.js"),
    // vectorscores core
    url.asset(data.site.baseUrl, "/js/vectorscores.js"),
    // modules
    ...modules
      .filter((module) =>
        process.env.WEBSOCKETS ? true : module !== "websockets"
      )
      .map((module) =>
        url.asset(data.site.baseUrl, `/modules/${module}/index.js`)
      ),
    // score script
    "index.js",
  ];

  return catMap(
    (src) => `<script src="${src}" charset="utf-8"></script>`,
    sources
  );
};
