const { catMap, url } = require("eleventy-lib");

module.exports = (data) => {
  const modules = data.modules || [];

  const hrefs = [
    // base score styles
    url.asset(data.site.baseUrl, "/css/score.css"),
    // styles from score-set if movement
    data.layout === "movement" ? "../styles.css" : null,
    // modules
    ...modules.map((module) =>
      url.asset(data.site.baseUrl, `/modules/${module}/styles.css`)
    ),
    // score styles
    "styles.css",
  ].filter(Boolean);

  return catMap((href) => `<link rel="stylesheet" href=${href}>`, hrefs);
};
