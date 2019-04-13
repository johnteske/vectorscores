const requireRoot = require('app-root-path').require
const { catMap, maybe, maybeTemplate } = requireRoot('render-utils')

const workLink = require('./work-link.11ty.js')

const filterByStatus = (works, status) => works.filter(w => w.data.status === status);
const hasFormat = (d, format) => d.data.formats && d.data.formats.includes(format);

const workRow = d =>
    `<tr class="work-list-row">
        <td>${workLink(d)}</td>
        <td class="work-list-duration">
            ${maybe(d.data.duration)}
        </td>
        <td class="work-list-formats">
            ${maybeTemplate('score', hasFormat(d, 'score'))}
        </td>
        <td class="work-list-formats">
            ${maybeTemplate('parts', hasFormat(d, 'parts'))}
        </td>
     </tr>`

module.exports = data => {
    const works = data.collections.all.filter(f => f.data.layout === 'score');

    return `
    <h3>Published</h3>
    <table class="work-list">
        ${catMap(workRow, filterByStatus(works, 'published'))}
    </table>
    
    <h3>Works in progress</h3>
    <table class="work-list">
        ${catMap(workRow, filterByStatus(works, 'wip'))}
    </table>
    
    <h3>Examples and tests</h3>
    <table class="work-list">
        ${catMap(workRow, filterByStatus(works, 'test'))}
    </table>

    <h3>Unlisted (shown during Node update)</h3>
    <table class="work-list">
        ${catMap(workRow, filterByStatus(works, 'unlisted'))}
    </table>`
}
