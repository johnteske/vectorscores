const requireRoot = require("app-root-path").require;
const { title } = require("eleventy-lib");

const partialPath = "_includes/partials/score";
const styles = requireRoot(`${partialPath}/styles.11ty.js`);
const header = requireRoot(`${partialPath}/header.11ty.js`);
const footer = requireRoot(`${partialPath}/footer.11ty.js`);
const modals = requireRoot(`${partialPath}/modals.11ty.js`);
const scripts = requireRoot(`${partialPath}/scripts.11ty.js`);

module.exports = data => {
  return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${title(data.title, data.site.title)}</title>
        ${styles(data)}
    </head>
    <body>
        ${header(data)}
        <main>
            <svg class="main"></svg>
            ${data.content}
        </main>
        ${footer(data)}
        ${modals(data)}
        ${scripts(data)}
        <script src="index.js" charset="utf-8"></script>
    </body>
    </html>`; }
