const requireRoot = require("app-root-path").require;
const workList = requireRoot("_includes/partials/work-list-by-status.11ty.js");

module.exports = class {
  data() {
    return {
      layout: "default",
      permalink: "/"
    };
  }

  render(data) {
    return `
        <span class="vectorscores">vectorscores</span> is a new series of dynamic compositions.
        <p>The scores are written algorithmically so the works as a whole are crafted but the details are unique for each performance.</p>

        <h2>Scores</h2>
        ${workList(data)}`;
  }
};
