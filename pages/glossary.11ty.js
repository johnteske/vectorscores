const slugify = require("slugify");
const { catMap, maybe } = require("eleventy-lib");

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
      ${maybe(
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
