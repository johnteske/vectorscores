const { url } = require("eleventy-lib");

module.exports = data =>
  `<a href="${url.base(data.data.site.baseUrl, data.url)}" class="work-title">${data.data.title}</a>`;
