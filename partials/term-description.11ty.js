const requireRoot = require("app-root-path").require;

const glossary = requireRoot(`_data/glossary.json`);

module.exports = (termName) => {
  const term = glossary.find((t) => t.name === termName);
  if (typeof termName !== "string") {
    return 'asd'
  } 
  return term.description;
};
