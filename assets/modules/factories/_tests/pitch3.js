const path = require('path')
const { test, getWindowFromFile } = require(path.resolve('.', 'bin/js/tape-setup'))

test.only('factories.pitch3 and factories.pitch3', t => {
    getWindowFromFile('_site/assets/modules/factories/index.html', window => {
        const { VS } = window

        const pitchClass3 = VS.factories.pitchClass3()

        pitchClass3.noteName('f#').transpose(4)
        t.equal(pitchClass3.number(), 10)
        t.equal(pitchClass3.noteName(), 'a#')

        //

        const pitch3 = VS.factories.pitch3()

        pitch3.transpose(7)
        t.equal(pitch3.noteName(), 'g')

        pitch3.transpose(13)
        t.equal(pitch3.noteName(), 'g#')
        t.equal(pitch3.number(), 8)

        pitch3.number(0)
        t.equal(pitch3.noteName(), 'c')

        //

        const pitch3b = VS.factories.pitch3()

        pitch3b.noteName('g')
        t.equal(pitch3b.pitch(), 55)

        //

        const pitch3c = VS.factories.pitch3()

        pitch3c.number(1)
        t.equal(pitch3c.pitch(), 49)

        //

        const pitch3d = VS.factories.pitch3()

        pitch3d.octave(5)
        t.equal(pitch3d.pitch(), 60)

        t.end()
    })
})
