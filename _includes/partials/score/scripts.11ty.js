const rootRequire = require('app-root-path').require
const { assetsUrl, catMap } = rootRequire('render-utils')

module.exports = data =>
    `<script src="${assetsUrl('/js/lib/d3.v4.min.js')}" charset="utf-8"></script>
    <script src="${assetsUrl('/js/vectorscores.js')}" charset="utf-8"></script>
    ${data.modules ? catMap(m => `<script src="${assetsUrl(`/modules/${m}.js`)}" charset="utf-8"></script>`, data.modules) : ''}`;
