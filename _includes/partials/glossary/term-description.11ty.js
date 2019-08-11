const requireRoot = require("app-root-path").require;

const partialPath = "_includes/partials";
const glossary = requireRoot(`_data/glossary.json`);

module.exports = termName => {
  const term = glossary.find(t => t.name === termName);
  return term.description;
};
