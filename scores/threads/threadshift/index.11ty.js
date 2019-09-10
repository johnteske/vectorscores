const options = require("./_options.11ty.js");

module.exports = class {
  data() {
    return {
      layout: "movement",
      title: "threadshift",
      composer: "John Teske",
      status: "wip",
      // options: `<button id="save-svg">Save SVG</button>`,
      options: options(),
      modules: ["bravura", "dictionary", "websockets"]
    };
  }

  render(data) {
    return ``;
  }
};
