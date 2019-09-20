const baseTemplateData = require("../base-template-data");

module.exports = class {
  data() {
    return {
      ...baseTemplateData,
      order: 2.05,
      title: "libera me",
      status: "wip",
      modules: [...baseTemplateData.modules, "line-cloud"]
    };
  }

  render(data) {
    return ``;
  }
};
