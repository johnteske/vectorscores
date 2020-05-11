const requireRoot = require("app-root-path").require;
const { title, url: _url } = require("eleventy-lib");
const _ = require("lodash");
const canonicalUrl = (site, url) =>
  [site.url, site.baseurl, url.replace("index.html", "")].join("");

module.exports = (data) => {
  const url = { asset: _.curry(_url.asset)(data.site.baseUrl) };
  return `<head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">

      <title>${title(data.site.title, data.title)}</title>
      <meta name="description" content="${data.site.description}">

      <link rel="stylesheet" type="text/css" href="${url.asset(
        "/css/page.css"
      )}">
      <link rel="canonical" href="${canonicalUrl(data.site, data.page.url)}">
    </head>`;
};
