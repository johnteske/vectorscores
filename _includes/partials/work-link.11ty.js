const requireRoot = require('app-root-path').require
const { maybe, maybeTemplate } = requireRoot('render-utils')

const workLink = d =>
    `<a href="${d.url}" class="work-title">${d.data.title}</a>` +
    `${maybeTemplate(`, for ${d.data.instrumentation}`, d.data.instrumentation)}`

module.exports = workLink
