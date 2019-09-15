const baseTemplateData = require("../base-template-data");

module.exports = class {
  data() {
    return {
      ...baseTemplateData,
      title: "blood rug",
      status: "wip",
      modules: [...baseTemplateData.modules, "bravura"]
    };
  }

  render(data) {
    return ``;
  }
};
