const options = require("./_options");

module.exports = class {
  data() {
    return {
      layout: "score",
      title: "swell", // 2013
      composer: "John Teske",
      status: "published",
      instrumentation: "for any ensemble, (4+)",
      formats: ["score"],
      // info: info(),
      // within each bar, play the given pitches, in any order
      // pitches may be transposed to any comfortable octave
      options: options(),
      modules: ["websockets"]
    };
  }

  render(data) {
    return ``;
  }
};
