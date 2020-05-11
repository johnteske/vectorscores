module.exports = class {
  data() {
    return {
      layout: "score",
      title: "timing controls",
      status: "test",
      info: "<h3>Playground for event timing</h3>",
    };
  }

  render(data) {
    return `<p id="events"></p>`;
  }
};
