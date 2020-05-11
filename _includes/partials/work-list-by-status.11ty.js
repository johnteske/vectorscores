const requireRoot = require("app-root-path").require;
const { movementsFromUrl } = requireRoot("render-utils");
const { catMap, maybe } = require("eleventy-lib");

const workLink = require("./work-link.11ty.js");

const filterByStatus = (works, status) =>
  works.filter(w => w.data.status === status);
const hasFormat = (d, format) =>
  d.data.formats && d.data.formats.includes(format);

const workRow = d =>
  `<tr class="work-list-row">
        <td>
          ${workLink(d)}${maybe(
    `, for ${d.data.instrumentation}`,
    d.data.instrumentation
  )}
        </td>
        <td class="work-list-duration">
            ${maybe(d.data.duration)}
        </td>
        <td class="work-list-duration">
            ${maybe(mvts => `${mvts} mvts`, movementsFromUrl(d.url, d.data).length || null)}
        </td>
        <td class="work-list-formats">
            ${maybe("score", hasFormat(d, "score"))}
        </td>
        <td class="work-list-formats">
            ${maybe("parts", hasFormat(d, "parts"))}
        </td>
     </tr>`;

const scoreLayouts = ["score", "score-set"];

module.exports = data => {
  const works = data.collections.all.filter(f =>
    scoreLayouts.includes(f.data.layout)
  );

  return `
    <h3>Published</h3>
    <table class="work-list">
        ${catMap(workRow, filterByStatus(works, "published"))}
    </table>
    
    <h3>Works in progress</h3>
    <table class="work-list">
        ${catMap(workRow, filterByStatus(works, "wip"))}
    </table>
    
    <h3>Examples and tests</h3>
    <table class="work-list">
        ${catMap(workRow, filterByStatus(works, "test"))}
    </table>`;
};
