const path = require('path')
const { test, getWindowFromFile } = require(path.resolve('.', 'bin/js/tape-setup'))

let window

test('setup', t => {
    getWindowFromFile('_site/assets/modules/factories/index.html', loadedWindow => {
        window = loadedWindow
        t.end()
    })
})

test('factories.pitch', t => {
    const { VS } = window

    const pitch = VS.factories.pitch()
        .noteName('g')
        .octave(5)

    t.equal(pitch.noteName(), 'g', 'should have note name of \'g\', given pitch G5')
    t.equal(pitch.octave(), 5, 'should have octave of 5, given pitch G5')
    t.equal(pitch.number(), 7, 'should have pitch number of 7, given pitch G5')
    t.equal(pitch.pitch(), 67, 'should have pitch of 67, given pitch G5')

    t.end()
})

test('factories.pitch transposition', t => {
    const { VS } = window

    const pitch = VS.factories.pitch()
        .pitch(60)

    t.equal(pitch.pitch(), 60)
    t.equal(pitch.number(), 0)
    t.equal(pitch.noteName(), 'c')
    t.equal(pitch.octave(), 5)

    pitch.transpose(7)

    t.equal(pitch.pitch(), 67)
    t.equal(pitch.number(), 7)
    t.equal(pitch.noteName(), 'g')
    t.equal(pitch.octave(), 5)

    pitch.transpose(-27)

    t.equal(pitch.pitch(), 40)
    t.equal(pitch.number(), 4)
    t.equal(pitch.noteName(), 'e')
    t.equal(pitch.octave(), 3)

    t.end()
})
