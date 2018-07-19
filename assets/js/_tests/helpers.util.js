const path = require('path')
const { loadDomThenTest } = require(path.resolve('.', 'bin/js/tape-setup'))

const htmlPath = '_site/scores/tutorial/index.html'

loadDomThenTest('VS#getQueryString', htmlPath, (t, window) => {
    const { VS } = window
    const url = 'http://localhost:4000/vectorscores/scores/adsr/?parts=4&showall=on'

    t.equal(VS.getQueryString('parts', url), '4', 'return value as string given query parameter that exists in url')
    t.equal(VS.getQueryString('foo', url), null, 'return null given query parameter that does not exist in url')

    t.end()
})

loadDomThenTest('VS#makeQueryString', htmlPath, (t, window) => {
    const { VS } = window

    t.equal(VS.makeQueryString({ a: '1' }), 'a=1', 'return query string')
    t.equal(VS.makeQueryString({ a: '1', b: '2' }), 'a=1&b=2', 'return query string joined by \'&\'')

    t.end()
})

loadDomThenTest('VS#constant', htmlPath, (t, window) => {
    const { VS } = window
    const value = 5
    const c = VS.constant(value)

    t.equal(typeof c, 'function', 'be type \'function\'')
    t.equal(c(), value, 'return same value initialized with')

    t.end()
})
