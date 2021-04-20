const requireRoot = require("app-root-path").require;

const baseTemplateData = require("../base-template-data");
const saveSVGSettings = requireRoot(
  "./assets/modules/save-svg/settings.11ty.js"
);

module.exports = class {
  data() {
    return {
      ...baseTemplateData,
      options: `${saveSVGSettings()}${baseTemplateData.options}`,
      title: "libera me",
      status: "wip",
      modules: [...baseTemplateData.modules, "line-cloud", "save-svg"],
    };
  }

  render() {
    return ``;
  }
};
