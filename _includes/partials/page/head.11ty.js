const requireRoot = require('app-root-path').require;
const { assetsUrl } = requireRoot("render-utils.js");
const canonicalUrl = (site, url) =>
  [site.url, site.baseurl, url.replace("index.html", "")].join("");

module.exports = ({ site, page, title }) => {
  const titleValue = title => (title ? `${site.title} | ${title}` : site.title);

  return `<head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">

      <title>${titleValue(title)}</title>
      <meta name="description" content="${site.description}">

      <link rel="stylesheet" type="text/css" href="${assetsUrl(
        site,
        "/css/main.css"
      )}">
      <link rel="canonical" href="${canonicalUrl(site, page.url)}">
    </head>`;
};
