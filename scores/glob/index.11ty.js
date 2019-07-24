const options = require("./_options.11ty.js");

module.exports = class {
  data() {
    return {
      layout: "score",
      title: "glob",
      composer: "John Teske",
      instrumentation: "any ensemble",
      status: "wip",
      options: options(),
      modules: [
        "bravura",
        "dictionary",
        "pitch-class",
        "settings/radio",
        "settings/number",
        "settings/pitch-classes"
      ]
    };
  }

  render(data) {
    return ``;
  }
};
