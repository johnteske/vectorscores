const baseTemplateData = require("../base-template-data");

module.exports = class {
  data() {
    return {
      ...baseTemplateData,
      order: 2.07,
      title: "klaxon wail",
      status: "wip",
      modules: [...baseTemplateData.modules, "bravura", "dictionary"]
    };
  }

  render(data) {
    return ``;
  }
};
