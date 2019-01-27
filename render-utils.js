const handleUndefined = input => input || "";
const catMap = (f, a) => a.map(f).join("");
const slugify = todo => todo.toLowerCase().replace(/ /g, "-");

const assetsUrl = (site, url) => site.assetsUrl + url;

module.exports = {
  handleUndefined,
  catMap,
  slugify,
  assetsUrl
};
