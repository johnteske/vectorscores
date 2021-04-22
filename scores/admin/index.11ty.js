const { catMap } = require("eleventy-lib");

const options = require("./_options.11ty.js");

const allowlist = ["adsr", "prelude", "swell", "intonations"];

module.exports = class {
  data() {
    return {
      layout: "score",
      title: "admin",
      status: "unlisted",
      options: "noop",
      modules: ["websockets"],
    };
  }

  render(data) {
    const works = data.collections.all
      .filter((w) => ["score", "movement"].includes(w.data.layout))
      .filter((w) => allowlist.some((name) => w.url.includes(name)))
      .sort((a, b) => {
        return a.data.order - b.data.order;
      });

    return `
      ${options()}
      ${catMap((work) => `<button>${work.url}</button>`, works)}
    `;
  }
};
