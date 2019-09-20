const baseTemplateData = require("../base-template-data");

module.exports = class {
  data() {
    return {
      ...baseTemplateData,
      order: 2.08,
      title: "papercut butterflies",
      status: "wip",
      modules: [...baseTemplateData.modules, "bravura", "dictionary"]
    };
  }

  render(data) {
    return ``;
  }
};
