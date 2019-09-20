const options = require("./_options");

module.exports = class {
  data() {
    return {
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
