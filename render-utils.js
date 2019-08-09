const fs = require("fs");

const handleUndefined = input => input || "";
const catMap = (f, a) => a.map(f).join("");
const slugify = todo => todo.toLowerCase().replace(/ /g, "-");

const withBaseUrl = (site, url) => `/${site.baseUrl}/${url}`.replace(/\/+/g, "/")
const assetsUrl = (site, url) => withBaseUrl(site, site.assetsUrl + url);

const fileExists = path => fs.existsSync(path);

const maybe = value => (value ? value : "");
const maybeTemplate = (template, value) => (value ? template : "");
const maybeFunction = (template, value) => (value ? template(value) : "");

const forEachModuleWithFile = (basename, render, data) => {
  return data.modules
    ? catMap(m => {
        const path = `/modules/${m}/${basename}`;
        return maybeTemplate(
          render(assetsUrl(data.site, path)),
          fileExists(`./assets/${path}`)
        );
      }, data.modules)
    : "";
};

const movementsFromUrl = (url, data) => data.data.collections.all.filter(
  page => page.data.layout === "movement" && page.url.includes(url)
);

module.exports = {
  handleUndefined,
  catMap,
  slugify,
  withBaseUrl,
  assetsUrl,
  fileExists,
  maybe,
  maybeTemplate,
  maybeFunction,
  forEachModuleWithFile,
  movementsFromUrl
};
