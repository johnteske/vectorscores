const scoreLayouts = ["score", "score-set"];
const movementLayouts = ["movement"];

type Work = {
  title: string;
  instrumentation: string;
  duration: string;
  movements: Work[];
  formats: string[]; // ENUM
  status: string; // ENUM
  url: string;
};

function workMap(w): Work {
  return {
    title: w.data.title,
    duration: w.data.duration,
    instrumentation: w.data.instrumentation,
    status: w.data.status,
    formats: w.data.formats,
    movements: [],
    url: w.url,
  };
}

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
      .map(workMap)
      .map((work) => ({
        ...work,
        movements: movements
          .filter((m) => m.url.includes(work.url))
          .map(workMap),
      }));

    return JSON.stringify(works);
  }
};
