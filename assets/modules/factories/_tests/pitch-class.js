const path = require('path')
const { test, getWindowFromFile } = require(path.resolve('.', 'bin/js/tape-setup'))

let window

test('setup', t => {
    getWindowFromFile('_site/assets/modules/factories/index.html', loadedWindow => {
        window = loadedWindow
        t.end()
    })
})

test('factory.pitchClass', t => {
    const { VS } = window

    let pc = VS.factories.pitchClass()
        .noteName('f#')

    t.equal(pc.noteName(), 'f#', 'should return note name \'f#\', given note name \'f#\'')
    t.equal(pc.number(), 6, 'should return pitch number of 6, given note name \'f#\'')

    t.end()
})

test('factory.pitchClass', t => {
    const { VS } = window

    let pc = VS.factories.pitchClass()
        .noteName('c')
        .transpose(6)

    t.equal(pc.number(), 6, 'should return pitch number of 6, given note name \'c\' and transposed +6 semitones')
    t.equal(pc.noteName(), 'f#', 'should return note name \'f#\', given note name \'c\' and transposed +6 semitones')

    t.end()
})

test('factory.pitchClass', t => {
    const { VS } = window

    let pc = VS.factories.pitchClass()
        .noteName('c')
        .transpose(-6)

    t.equal(pc.number(), 6, 'should return pitch number of 6, given note name \'c\' and transposed -6 semitones')
    t.equal(pc.noteName(), 'f#', 'should return note name \'f#\', given note name \'c\' and transposed -6 semitones')

    t.end()
})
