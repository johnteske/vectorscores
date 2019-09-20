const options = require("./_options");

module.exports = class {
  data() {
    return {
      order: 1.04,
      layout: "score",
      title: "trashfire",
      composer: "John Teske",
      instrumentation: "any ensemble",
      options: options(),
      status: "published",
      formats: "score",
      modules: ["websockets"]
    };
  }

  render(data) {
    return "";
  }
};
