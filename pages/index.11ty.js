const workList = require("./../_includes/partials/work-list.11ty.js");

module.exports = class {
  data() {
    return {
      layout: "default",
      permalink: "/",
      templateEngineOverride: "11ty.js,md"
    };
  }

  render(data) {
    return `
<span class="vectorscores">_vectorscores_</span> is a new series of dynamic compositions.
The scores are written algorithmically so the works as a whole are crafted but the details are unique for each performance.

## Scores
${workList(data)}`;
  }
};
