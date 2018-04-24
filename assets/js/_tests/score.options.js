const path = require('path')
const { test, setupDOM } = require(path.resolve('.', 'bin/js/tape-setup'))
setupDOM('_site/scores/tutorial/index.html')

const vsPath = path.resolve('.', '_site/assets/js/vectorscores.js')

// Clear require cache so VS (and VS.score.options) do not carry over between tests
function clearVSFromCache() {
    delete require.cache[vsPath]
}

const url = 'http://localhost:4000/vectorscores/scores/adsr/?parts=4&showall=on'

const MockControl = function() {}
MockControl.prototype.setValue = function() {}

test('VS.score.options', t => {
    const VS = require(vsPath)

    VS.score.options.add('parts', '2', new MockControl())
    const options = VS.score.options.setFromQueryString(url)

    t.deepEqual(options, { parts: '4' }, 'should set option from query string')

    clearVSFromCache()

    t.end()
})

test('VS.score.options', t => {
    const VS = require(vsPath)

    VS.score.options.add('test', 'yes', new MockControl())
    const options = VS.score.options.setFromQueryString(url)

    t.deepEqual(options, { test: 'yes' }, 'should use default if parameter is not in query string')

    clearVSFromCache()

    t.end()
})

test('VS.score.options', t => {
    const VS = require(vsPath)

    VS.score.options.add('parts', null, new MockControl())
    const options = VS.score.options.setFromQueryString(url)

    t.deepEqual(options, { parts: '4' }, 'should set option from query string with a default of \'null\'')

    clearVSFromCache()

    t.end()
})
