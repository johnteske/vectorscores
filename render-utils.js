const fs = require("fs");
const { catMap, maybe, url } = require("eleventy-lib");

const fileExists = path => fs.existsSync(path);

const forEachModuleWithFile = (basename, render, data) => {
  return data.modules
    ? catMap(m => {
        const path = `/modules/${m}/${basename}`;
        return maybe(
          render(url.asset(data.site.baseUrl, path)),
          fileExists(`./assets/${path}`)
        );
      }, data.modules)
    : "";
};

const movementsFromUrl = (url, data) =>
  data.collections.all.filter(
    page => page.data.layout === "movement" && page.url.includes(url)
  );

module.exports = {
  fileExists,
  forEachModuleWithFile,
  movementsFromUrl
};
