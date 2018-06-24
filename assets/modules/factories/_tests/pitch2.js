const path = require('path')
const { test, getWindowFromFile } = require(path.resolve('.', 'bin/js/tape-setup'))

test.only('factories.pitch2 and factories.pitch2', t => {
    getWindowFromFile('_site/assets/modules/factories/index.html', window => {
        const { VS } = window

        const pitchClass2 = VS.factories.pitchClass2()

        pitchClass2.number(6).transpose(4)
        t.equal(pitchClass2.number(), 10)
        t.equal(pitchClass2.noteName(), 'a#')

        const pitch2 = VS.factories.pitch2()
            .noteName('g')
            .octave(5)

        pitch2.transpose(13)
        t.equal(pitch2.noteName(), 'g#')
        t.equal(pitch2.number(), 8)
        t.equal(pitch2.octave(), 6)

        pitch2.number(0).transpose(-36)
        t.equal(pitch2.noteName(), 'c')
        t.equal(pitch2.octave(), 3)

        t.end()
    })
})
