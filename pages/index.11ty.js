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
        <script>window.location.replace("/scores/swell/");
</script>
        `;
  }
};
