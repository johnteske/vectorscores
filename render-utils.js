const handleUndefined = input => input || "";
const catMap = (f, a) => a.map(f).join("");
const slugify = todo => todo.toLowerCase().replace(/ /g, "-");

module.exports = {
  handleUndefined,
  catMap,
  slugify
};
