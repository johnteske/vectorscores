const path = require('path')
const { loadDomThenTest } = require(path.resolve('.', 'bin/js/tape-setup'))

loadDomThenTest('cueBlink', '_site/assets/modules/cue/index.html', (t, window) => {
    const { d3, document, VS } = window

    let indicator = d3.select(document).select('svg').append('circle')

    let cue = VS.cueBlink(indicator)
        .beats(2)

    t.equal(cue.beats(), 2, 'should get and set number of beats via beats method')

    t.end()
})
