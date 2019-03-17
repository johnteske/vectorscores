const rootRequire = require('app-root-path').require
const { assetsUrl, catMap, fileExists } = rootRequire('render-utils')

module.exports = data =>
    `<script src="${assetsUrl(data.site, '/js/lib/d3.v4.min.js')}" charset="utf-8"></script>
    <script src="${assetsUrl(data.site, '/js/vectorscores.js')}" charset="utf-8"></script>
    ${data.modules ?
      catMap(m => {
        const path = assetsUrl(data.site, `/modules/${m}.js`)
        return fileExists(path) ? `<script src="${path}" charset="utf-8"></script>` : ''},
      data.modules)
    : ''}`;
