const workList = require("./../_includes/work-list/index.11ty.js");

module.exports = class {
  data() {
    return {
      templateEngineOverride: "11ty.js,md",
      title: "Scores",
      layout: "page",
      permalink: "/scores/",
      tags: ["topNav"]
    };
  }

  render() {
    return workList;
  }
};
