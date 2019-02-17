const rootRequire = require('app-root-path').require
const { assetsUrl, catMap } = rootRequire('render-utils')

module.exports = data =>
    `<script src="${assetsUrl(data.site, '/js/lib/d3.v4.min.js')}" charset="utf-8"></script>
    <script src="${assetsUrl(data.site, '/js/vectorscores.js')}" charset="utf-8"></script>
    ${data.modules ? catMap(m => `<script src="${assetsUrl(data.site, `/modules/${m}.js`)}" charset="utf-8"></script>`, data.modules) : ''}`;
