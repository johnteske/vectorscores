const fs = require("fs");
const path = require("path");

const readme = fs.readFileSync(
  path.resolve(__dirname, "./../_includes/docs/README.md"),
  "utf8"
);

const vectorscores = "*vectorscores*";

module.exports = class {
  data() {
    return {
      templateEngineOverride: "11ty.js,md",
      title: "About",
      layout: "page",
      permalink: "/about/",
      tags: ["topNav"],
    };
  }

  render() {
    return readme.substring(readme.indexOf(vectorscores) + vectorscores.length);
  }
};
