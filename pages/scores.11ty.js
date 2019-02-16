const requireRoot = require('app-root-path').require
const workList = requireRoot("_includes/partials/page/work-list.11ty.js");

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
