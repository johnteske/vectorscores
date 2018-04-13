const path = require('path')
const test = require(path.resolve('.', 'bin/js/node_modules/tape'))
const JSDOM = require(path.resolve('.', 'bin/js/node_modules/jsdom')).JSDOM
const fs = require('fs')
const html = fs.readFileSync(path.resolve('.', '_site/scores/tutorial/index.html'), 'utf8')
const DOM = new JSDOM(html)
global.window = DOM.window
global.document = DOM.window.document

const VS = require(path.resolve('.', '_site/assets/js/vectorscores.js'))

test('VS#clamp', t => {
    t.equal(VS.clamp(11, 0, 5), 5, 'value greater than max should return max')
    t.equal(VS.clamp(-11, 0, 5), 0, 'value less than min should return min')
    t.equal(VS.clamp(2.5, 0, 5), 2.5, 'value between min and max should return value')

    t.end()
})
