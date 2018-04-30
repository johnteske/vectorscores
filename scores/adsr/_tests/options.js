const path = require('path')
const { test, setupDOM } = require(path.resolve('.', 'bin/js/tape-setup'))
setupDOM('_site/scores/adsr/index.html')

test('ad;sr', t => {
    const optionsButton = document.getElementById('score-options-open')

    t.true(optionsButton instanceof window.HTMLElement, 'should have a #score-options-open button')

    t.end()
})
