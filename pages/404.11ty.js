module.exports = class {
  data() {
    return {
      title: "404",
      layout: "page",
      permalink: "/404.html"
    };
  }

  render(data) {
    return `Page not found.`;
  }
};
