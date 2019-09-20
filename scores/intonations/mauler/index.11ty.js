const baseTemplateData = require("../base-template-data");

module.exports = class {
  data() {
    return {
      ...baseTemplateData,
      order: 2.04,
      title: "mauler",
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
