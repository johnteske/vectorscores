const path = require('path')
const { test, setupDOM } = require(path.resolve('.', 'bin/js/tape-setup'))
setupDOM('_site/scores/tutorial/index.html')

const VS = require(path.resolve('.', '_site/assets/js/vectorscores.js'))

test('VS#getQueryString', t => {
    const url = 'http://localhost:4000/vectorscores/scores/adsr/?parts=4&showall=on'

    t.equal(VS.getQueryString('parts', url), '4', 'return value as string given query parameter that exists in url')
    t.equal(VS.getQueryString('foo', url), null, 'return null given query parameter that does not exist in url')

    t.end()
})

test('VS#makeQueryString', t => {
    t.equal(VS.makeQueryString({ a: '1' }), 'a=1', 'return query string')
    t.equal(VS.makeQueryString({ a: '1', b: '2' }), 'a=1&b=2', 'return query string joined by \'&\'')

    t.end()
})

test('VS#constant', t => {
    const value = 5
    const c = VS.constant(value)

    t.equal(typeof c, 'function', 'be type \'function\'')
    t.equal(c(), value, 'return same value initialized with')

    t.end()
})
