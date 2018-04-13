const path = require('path')
const test = require(path.resolve('.', 'bin/js/node_modules/tape'))
const JSDOM = require(path.resolve('.', 'bin/js/node_modules/jsdom')).JSDOM
const fs = require('fs')
const html = fs.readFileSync(path.resolve('.', '_site/scores/tutorial/index.html'), 'utf8')
const DOM = new JSDOM(html)
global.window = DOM.window
global.document = DOM.window.document

const VS = require(path.resolve('.', '_site/assets/js/vectorscores.js'))

test('VS#clamp', function(t) {
    t.equal(VS.clamp(10, 0, 5), 5)
    t.end()
})
