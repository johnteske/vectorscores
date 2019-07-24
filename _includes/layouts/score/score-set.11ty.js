const requireRoot = require("app-root-path").require;
const {
  assetsUrl,
  catMap,
  forEachModuleWithFile,
  handleUndefined
} = requireRoot("render-utils.js");
const { scoreTitle } = requireRoot("_eleventy/title.js");

const partialPath = "_includes/partials";
const header = requireRoot(`${partialPath}/score/header.11ty.js`);
const workLink = requireRoot(`${partialPath}/work-link.11ty.js`);

module.exports = data => {
  const works = data.collections.all.filter(
    w => w.data.layout === "movement" && w.url.includes(data.page.url)
  );

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${scoreTitle(data.site.title, data.title)}</title>
        <link rel="stylesheet" href="${assetsUrl(data.site, "/css/score.css")}">
    </head>
    <body class="score-set">
        ${header(data)}
        <main>
            ${data.content}
            <ul class="work-list">
                ${catMap(work => `<li>${workLink(work)}</li>`, works)}
            </ul>
        </main>
    </body>
    </html>`;
};
