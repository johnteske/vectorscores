const info = require("./_info.11ty.js");
const options = require("./_options.11ty.js");

module.exports = class {
  data() {
    return {
      layout: "score",
      title: "ad;sr",
      // publish_date: 2015, rev. 2017
      dedication: "for Friction Quartet",
      instrumentation: "any ensemble (3+)",
      duration: "6&prime;",
      formats: ["score", "parts"],
      composer: "John Teske",
      status: "published",
      info: info(),
      options: options(),
      modules: [
        "bravura",
        // description-list
        "cue/blink",
        "x-by-duration",
        "dictionary",
        "websockets",
        "settings/number",
        "settings/checkbox"
      ]
    };
  }

  render(data) {
    return ``;
  }
};
