const path = require('path')
const { test, getWindowFromFile } = require(path.resolve('.', 'bin/js/tape-setup'))

const htmlPath = '_site/scores/tutorial/index.html'
const url = 'http://localhost:4000/vectorscores/scores/adsr/?parts=4&showall=on'

const MockControl = function() {}
MockControl.prototype.set = function() {}

test('VS.score.options', t => {
    getWindowFromFile(htmlPath, window => {
        const VS = window.VS

        VS.score.options.add('parts', '2', new MockControl())
        const options = VS.score.options.setFromQueryString(url)

        t.deepEqual(options, { parts: '4' }, 'should set option from query string')

        t.end()
    })
})

test('VS.score.options', t => {
    getWindowFromFile(htmlPath, window => {
        const VS = window.VS

        VS.score.options.add('test', 'yes', new MockControl())
        const options = VS.score.options.setFromQueryString(url)

        t.deepEqual(options, { test: 'yes' }, 'should use default if parameter is not in query string')

        t.end()
    })
})

test('VS.score.options', t => {
    getWindowFromFile(htmlPath, window => {
        const VS = window.VS

        VS.score.options.add('parts', null, new MockControl())
        const options = VS.score.options.setFromQueryString(url)

        t.deepEqual(options, { parts: '4' }, 'should set option from query string with a default of \'null\'')

        t.end()
    })
})
