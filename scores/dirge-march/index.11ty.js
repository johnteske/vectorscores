const info = require("./_info.11ty.js");
const options = require("./_options.11ty.js");

module.exports = class {
  data() {
    return {
      layout: "score",
      title: "dirge,,march",
      instrumentation: "any ensemble (3+ pitched, 2+ percussive)",
      duration: "5&prime;39&Prime;",
      status: "wip",
      info: info(),
      options: options(),
      formats: "score",
      modules: [
        "bravura",
        "cue/blink",
        "globject",
        "dictionary",
        "x-by-duration",
        "trichords",
        "pitch-class",
        "settings/radio",
        "settings/pitch-classes",
        "settings/number",
        "line-cloud"
      ]
    };
  }
  render(data) {
    return ``;
  }
};
