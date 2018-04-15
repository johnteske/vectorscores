const path = require('path')
const { test, setupDOM } = require(path.resolve('.', 'bin/js/tape-setup'))
setupDOM('_site/scores/tutorial/index.html')

const VS = require(path.resolve('.', '_site/assets/js/vectorscores.js'))

test('VS#cb', t => {
    let value
    VS.cb(5)

    t.equal(value, undefined, 'do nothing if callback is not type function')

    t.end()
})

test('VS#cb', t => {
    let value
    const callback = () => { value = 5 }
    VS.cb(callback)

    t.equal(value, 5, 'execute function if callback is type function')

    t.end()
})

// TODO use JSDOM to test modal interaction, run as an integration test elsewhere
test('VS#getQueryString', t => {
    const url = 'http://localhost:4000/vectorscores/scores/adsr/?parts=4&showall=0'

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
