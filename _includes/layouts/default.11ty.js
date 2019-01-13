const head = require("./../partials/head.11ty.js");
const header = require("./../partials/header.11ty.js");
const footer = require("./../partials/footer.11ty.js");

module.exports = data =>
  `<!DOCTYPE html>
    <html>
        ${head(data)}
        <body>
            ${header(data)}
            <div class="page-content">
                <div class="wrapper">
                    ${data.content}
                </div>
            </div>
            ${footer(data)}
        </body>
    </html>`;
