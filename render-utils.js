const handleUndefined = input => input || "";
const catMap = (f, a) => a.map(f).join("");

module.exports = {
  handleUndefined,
  catMap
}
