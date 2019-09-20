const requireRoot = require("app-root-path").require;
const { catMap } = requireRoot("render-utils");

const options = require("./_options.11ty.js");

const whitelist = ["adsr", "prelude", "swell", "trashfire", "intonations"];

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
        const aOrder = a.data.order || -1;
        const bOrder = b.data.order || -1;
        return aOrder - bOrder;
      });

    return `
      ${options()}
      ${catMap(work => `${work.data.order} <button>${work.url}</button>`, works)}
    `;
  }
};
