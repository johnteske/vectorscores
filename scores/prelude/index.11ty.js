const info = require("./_info");
const options = require("./_options");

module.exports = class {
  data() {
    return {
      order: 3,
      layout: "score",
      title: "prelude",
      composer: "John Teske",
      status: "published",
      instrumentation: "for any ensemble",
      duration: "5&prime;", // TODO calculate more precisely
      formats: ["score"],
      info: info(),
      options: options(),
      modules: [
        "dictionary",
        "bravura",
        "pitch-class",
        "settings/radio",
        "settings/number",
        "settings/pitch-classes",
        "line-cloud",
        "cue/blink"
      ]
    };
  }

  render(data) {
    return ``;
  }
};
