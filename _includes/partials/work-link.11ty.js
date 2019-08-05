const requireRoot = require("app-root-path").require;
const { withBaseUrl } = requireRoot("render-utils");

module.exports = d =>
  `<a href="${withBaseUrl(d.data.site, d.url)}" class="work-title">${d.data.title}</a>`;
