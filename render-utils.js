const fs = require("fs");

const handleUndefined = input => input || "";
const catMap = (f, a) => a.map(f).join("");
const slugify = todo => todo.toLowerCase().replace(/ /g, "-");

const assetsUrl = (site, url) => site.assetsUrl + url;

const fileExists = path => fs.existsSync(path);

const maybe = value => (value ? value : "");
const maybeTemplate = (template, value) => (value ? template : "");

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

module.exports = {
  handleUndefined,
  catMap,
  slugify,
  assetsUrl,
  fileExists,
  maybe,
  maybeTemplate,
  forEachModuleWithFile
};
