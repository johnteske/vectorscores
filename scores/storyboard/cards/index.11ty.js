const options = require("./_options.11ty.js");

module.exports = class {
  data() {
    return {
      layout: "movement",
      title: "cards",
      status: "wip",
      options: options(),
      modules: [
        "cue/blink",
        "dictionary",
        "bravura",
        "pitch-class",
        "settings/radio"
      ]
    };
  }

  render(data) {
    return ``;
  }
};
