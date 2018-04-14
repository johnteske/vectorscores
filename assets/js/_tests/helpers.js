const path = require('path')
const test = require(path.resolve('.', 'bin/js/node_modules/tape'))
const JSDOM = require(path.resolve('.', 'bin/js/node_modules/jsdom')).JSDOM
const fs = require('fs')
const html = fs.readFileSync(path.resolve('.', '_site/scores/tutorial/index.html'), 'utf8')
const DOM = new JSDOM(html)
global.window = DOM.window
global.document = DOM.window.document

const VS = require(path.resolve('.', '_site/assets/js/vectorscores.js'))

test('VS#makeQueryString', t => {
    t.equal(VS.makeQueryString({ a: '1' }), 'a=1', 'return query string')
    t.equal(VS.makeQueryString({ a: '1', b: '2' }), 'a=1&b=2', 'return query string joined by \'&\'')

    t.end()
})

test('VS#clamp', t => {
    t.equal(VS.clamp(11, 0, 5), 5, 'return max when value is greater than max')
    t.equal(VS.clamp(-11, 0, 5), 0, 'return min when value is less than min')
    t.equal(VS.clamp(2.5, 0, 5), 2.5, 'return value when value is between min and max')

    t.end()
})

test('VS#normalize', t => {
    const min = -5
    const max = 5

    t.equal(VS.normalize(5, min, max), 1)
    t.equal(VS.normalize(0, min, max), 0.5)
    t.equal(VS.normalize(-5, min, max), 0)

    t.end()
})

test('VS#constant', t => {
    const five = VS.constant(5)

    t.equal(typeof five, 'function')
    t.equal(five(), 5)

    t.end()
})

test('VS#mod', t => {
    t.equal(VS.mod(6, 12), 6)
    t.equal(VS.mod(13, 12), 1)

    t.end()
})
