const path = require('path')
const { test, getWindowFromFile } = require(path.resolve('.', 'bin/js/tape-setup'))

test.only('factories.pitch2 and factories.pitch2', t => {
    getWindowFromFile('_site/assets/modules/factories/index.html', window => {
        const { VS } = window

        const pitchClass2 = VS.factories.pitchClass2()

        pitchClass2.noteName('f#').transpose(4)
        t.equal(pitchClass2.number(), 10)
        t.equal(pitchClass2.noteName(), 'a#')

        //

        const pitch2 = VS.factories.pitch2()

        pitch2.transpose(7)
        t.equal(pitch2.noteName(), 'g')

        pitch2.transpose(13)
        t.equal(pitch2.noteName(), 'g#')
        t.equal(pitch2.number(), 8)

        pitch2.number(0)
        t.equal(pitch2.noteName(), 'c')

        //

        const pitch2b = VS.factories.pitch2()

        pitch2b.noteName(7)
        t.equal(pitch2b.pitch(), 61) // fails as pitch is not updated from noteName method

        t.end()
    })
})
