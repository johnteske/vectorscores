const fs = require("fs");
const { catMap, maybe, url } = require("eleventy-lib");

const fileExists = (path) => fs.existsSync(path);

const forEachModuleWithFile = (basename, render, data) => {
  const modules = data.modules || [];
  const filtered = process.env.WEBSOCKETS
    ? modules
    : modules.filter((m) => m !== "websockets");
  return filtered.length
    ? catMap((m) => {
        const path = `/modules/${m}/${basename}`;
        return maybe(
          render(url.asset(data.site.baseUrl, path)),
          fileExists(`./assets/${path}`)
        );
      }, filtered)
    : "";
};

const movementsFromUrl = (url, data) =>
  data.collections.all.filter(
    (page) => page.data.layout === "movement" && page.url.includes(url)
  );

module.exports = {
  fileExists,
  forEachModuleWithFile,
  movementsFromUrl,
};
