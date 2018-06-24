const path = require('path')
const { test, getWindowFromFile } = require(path.resolve('.', 'bin/js/tape-setup'))

test('factories.pitch', t => {
    getWindowFromFile('_site/assets/modules/factories/index.html', window => {
        const { VS } = window

        const pitch = VS.factories.pitch()
            .noteName('g')
            .octave(5)

        t.equal(pitch.number(), 7, 'should return pitch number of 7, given note name \'g\'')
        t.equal(pitch.octave(), 5, 'should return octave of 5, given octave of 5')

        t.end()
    })
})
