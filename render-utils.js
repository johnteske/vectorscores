const handleUndefined = input => input || "";
const catMap = (f, a) => a.map(f).join("");
const slugify = todo => todo.toLowerCase().replace(/ /g, "-");

const assetsUrl = (site, url) => site.assetsUrl + url;

const maybe = (value) => value ? value : ''
const maybeTemplate = (template, value) => value ? template : ''

module.exports = {
  handleUndefined,
  catMap,
  slugify,
  assetsUrl,
  maybe,
  maybeTemplate
};
