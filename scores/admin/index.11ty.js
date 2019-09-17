const requireRoot = require("app-root-path").require;
const { catMap } = requireRoot("render-utils");

const options = require("./_options.11ty.js");

const whitelist = ["adsr", "prelude", "swell", "intonations"];

module.exports = class {
  data() {
    return {
      layout: "score",
      title: "admin",
      status: "unlisted",
      options: "noop",
      modules: ["websockets"]
    };
  }

  render(data) {
    const works = data.collections.all
      //.filter(w => ["score", "score-set", "movement"].includes(w.data.layout))
      .filter(w => ["score", "movement"].includes(w.data.layout))
      .filter(w => whitelist.some(name => w.url.includes(name)))
      //.filter(w => w.data.status !== "test")
      //.filter(w => w.data.status !== "unlisted");
      .sort((a, b) => {
        return a.data.order - b.data.order;
      });

    return `
      ${options()}
      ${catMap(work => `<button>${work.url}</button>`, works)}
    `;
  }
};
