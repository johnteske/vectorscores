const baseTemplateData = require("../base-template-data");

module.exports = class {
  data() {
    return {
      ...baseTemplateData,
      title: "bone flute",
      status: "wip",
      modules: [
        ...baseTemplateData.modules,
        "bravura",
        "dictionary",
        "line-cloud"
      ]
    };
  }

  render(data) {
    return ``;
  }
};
