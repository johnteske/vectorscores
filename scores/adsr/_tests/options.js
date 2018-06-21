const path = require('path')
const { test, getWindowFromFile } = require(path.resolve('.', 'bin/js/tape-setup'))

test('ad;sr', t => {
    getWindowFromFile('_site/scores/adsr/index.html', window => {
        const optionsButton = window.document.getElementById('score-options-open')

        t.true(optionsButton instanceof window.HTMLElement, 'should have a #score-options-open button')

        t.end()
    })
})
