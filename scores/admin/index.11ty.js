const options = require("./_options.11ty.js");

module.exports = class {
  data() {
    return {
      layout: "score",
      title: "admin",
      status: "unlisted",
      options: "noop",
      modules: ["websockets"]
    };
  }

  render(data) {
    return options();
  }
};
