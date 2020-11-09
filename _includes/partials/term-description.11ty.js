const requireRoot = require("app-root-path").require;

const glossary = requireRoot(`_data/glossary.json`);

module.exports = (termName) => {
  const term = glossary.find((t) => t.name === termName);
  // TODO this shouldn't need to be called
  if (typeof termName !== "string") {
    return;
  }
  return term.description;
};
