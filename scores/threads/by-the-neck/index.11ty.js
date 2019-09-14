const options = require("./_options.11ty.js");

module.exports = class {
  data() {
    return {
      layout: "movement",
      title: "by the fucking neck",
      composer: "John Teske",
      status: "wip",
      options: options(),
      modules: ["bravura", "dictionary", "websockets"]
    };
  }

  render(data) {
    return ``;
  }
};
