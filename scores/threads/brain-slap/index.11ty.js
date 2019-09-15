const baseTemplateData = require("../base-template-data");

module.exports = class {
  data() {
    return {
      ...baseTemplateData,
      title: "brain slap",
      status: "wip"
    };
  }

  render(data) {
    return ``;
  }
};
