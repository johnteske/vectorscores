const { catMap, handleUndefined } = require("../render-utils");

const slugify = todo => todo.toLowerCase().replace(/ /g, "-");

module.exports = class {
  data() {
    return {
      title: "Glossary",
      layout: "page",
      permalink: "/glossary/"
    };
  }

  render(data) {
    return `<dl>
      ${handleUndefined(
        data.glossary &&
          catMap(
            term =>
              `<dt id="${slugify(term.name)}">${term.name}</dt><dd>${
                term.description
              }</dd>`,
            data.glossary
          )
      )}
    </dl>`;
  }
};
