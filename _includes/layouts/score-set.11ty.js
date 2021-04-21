const requireRoot = require("app-root-path").require;
const { catMap, title, url } = require("eleventy-lib");
const { movementsFromUrl } = requireRoot("render-utils.js");

const partialPath = "_includes/partials";
const header = requireRoot(`${partialPath}/header.11ty.js`);
const workLink = requireRoot(`${partialPath}/work-link.11ty.js`);

const permalink = require("./permalink");

module.exports.data = {
  eleventyComputed: { permalink },
};

module.exports.render = (data) => {
  const works = movementsFromUrl(data.page.url, data);

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${title(data.title, data.site.title)}</title>
        <link rel="stylesheet" href="${url.asset(
          data.site.baseUrl,
          "/css/score.css"
        )}">
    </head>
    <body class="score-set">
        ${header(data)}
        <main>
            ${data.content}
            <ul class="work-list">
                ${catMap(
                  (work) => `<li>${workLink(work.data.title, url.base(data.site.baseUrl, work.url))}</li>`,
                  works
                )}
            </ul>
        </main>
    </body>
    </html>`;
};
