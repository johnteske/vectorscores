const options = require("./_options.11ty.js");

module.exports = class {
  data() {
    return {
      layout: "movement",
      title: "brain slap",
      composer: "John Teske",
      status: "wip",
      options: options(),
      modules: ["bravura", "websockets"]
    };
  }

  render(data) {
    return ``;
  }
};
