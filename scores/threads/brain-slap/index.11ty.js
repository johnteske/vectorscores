const baseTemplateData = require("../base-template-data")

module.exports = class {
  data() {
    return {
      ...baseTemplateData,
      title: "brain slap",
      status: "wip",
      modules: [ ...baseTemplateData.modules, "websockets" ]
    };
  }

  render(data) {
    return ``;
  }
};
