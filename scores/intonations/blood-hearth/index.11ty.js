const baseTemplateData = require("../base-template-data");

module.exports = class {
  data() {
    return {
      ...baseTemplateData,
      title: "blood on the hearth",
      status: "wip",
      modules: [...baseTemplateData.modules, "bravura", "dictionary"]
    };
  }

  render(data) {
    return ``;
  }
};
