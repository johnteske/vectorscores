const workList = require("./../_includes/partials/work-list.11ty.js");

module.exports = class {
  data() {
    return {
      title: "Scores",
      layout: "page",
      permalink: "/scores/",
      tags: ["topNav"]
    };
  }

  render(data) {
    return workList(data);
  }
};
