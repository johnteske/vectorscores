const baseTemplateData = require("../base-template-data");

module.exports = class {
  data() {
    return {
      ...baseTemplateData,
      title: "libera me",
      status: "wip",
      modules: [...baseTemplateData.modules, "line-cloud"],
    };
  }

  render(data) {
    return ``;
  }
};
