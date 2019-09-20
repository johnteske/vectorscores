const baseTemplateData = require("../base-template-data");

module.exports = class {
  data() {
    return {
      ...baseTemplateData,
      order: 2.01,
      title: "threadshift",
      status: "wip",
      modules: [
        ...baseTemplateData.modules,
        "bravura",
        "dictionary",
        "cue/blink"
      ]
    };
  }

  render(data) {
    return ``;
  }
};
