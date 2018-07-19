const path = require('path')
const { loadDomThenTest } = require(path.resolve('.', 'bin/js/tape-setup'))

loadDomThenTest('ad;sr', '_site/scores/adsr/index.html', (t, window) => {
    const optionsButton = window.document.getElementById('score-options-open')

    t.true(optionsButton instanceof window.HTMLElement, 'should have a #score-options-open button')

    t.end()
})
