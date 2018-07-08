const path = require('path')
const { test, getWindowFromFile } = require(path.resolve('.', 'bin/js/tape-setup'))

test('trashfire', t => {
    getWindowFromFile('_site/scores/trashfire/index.html', window => {
        // console.log(window.score)

        const eventTimesAreIntegers = window.score.every(bar => bar.time === Math.floor(bar.time))
        t.true(eventTimesAreIntegers, 'should have score event times as integers')

        t.end()
    })
})
