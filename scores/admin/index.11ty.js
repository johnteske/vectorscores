const options = require("./_options.11ty.js");

module.exports = class {
  data() {
    return {
      layout: "score",
      title: "admin",
      status: "unlisted",
      options: options(),
      modules: ["websockets"]
    };
  }

  render(data) {
    return ``;
  }
};
