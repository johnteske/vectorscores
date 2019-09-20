const baseTemplateData = require("../base-template-data");

module.exports = class {
  data() {
    return {
      ...baseTemplateData,
      order: 2.10,
      title: "death rattle",
      status: "wip",
      modules: [...baseTemplateData.modules, "bravura", "dictionary"]
    };
  }

  render(data) {
    return ``;
  }
};
