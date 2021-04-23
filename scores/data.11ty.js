module.exports = class {
  data() {
    return {
      permalink: "data.json",
    };
  }

  render(data) {
    return JSON.stringify(data.scores);
  }
};
