const path = require('path')
const { loadDomThenTest } = require(path.resolve('.', 'bin/js/tape-setup'))

const htmlPath = '_site/scores/tutorial/index.html'

function testEvent(str) {
    // return str; // NOTE never called
}

loadDomThenTest('VS.score events', htmlPath, (t, window) => {
    const { VS } = window

    const scoreLength = VS.score.getLength()

    VS.score.add(999, testEvent, ['a'])
    t.equal(VS.score.getLength(), scoreLength + 1, 'adding an event to score to add one to score length')

    t.end()
})

loadDomThenTest('VS.score play, pause, stop', htmlPath, (t, window) => {
    const { VS } = window

    t.equal(VS.score.isPlaying(), false, 'should not be flagged as playing on load')
    t.equal(VS.score.getPointer(), 0, 'should start with pointer at 0 on load')

    VS.score.play()
    t.equal(VS.score.isPlaying(), true, 'should be flagged as playing when playing')

    VS.score.pause()
    t.equal(VS.score.isPlaying(), false, 'should not be flagged as playing when paused')

    VS.score.stop()
    t.equal(VS.score.isPlaying(), false, 'should not be flagged as playing when stopped')

    t.end()
})
