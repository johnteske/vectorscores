const scoreLayouts = ["score", "score-set"];
const movementLayouts = ["movement"];

module.exports = class {
  data() {
    return {
      permalink: "works.json",
    };
  }
  render(data) {
    const movements = data.collections.all.filter((f) =>
      movementLayouts.includes(f.data.layout)
    );
    const works = data.collections.all
      .filter((f) => scoreLayouts.includes(f.data.layout))
      .map((w) => {
        return {
          title: w.data.title,
          duration: w.data.duration,
          instrumentation: w.data.instrumentation,
          status: w.data.status,
          formats: w.data.formats,
          movements: movements
            .filter((m) => m.url.includes(w.url))
            .map((m) => m.data.title),
          url: w.url,
        };
      });
    return JSON.stringify(works);
  }
};
