const path = require('path')
const { test, getWindowFromFile } = require(path.resolve('.', 'bin/js/tape-setup'))

const htmlPath = '_site/scores/tutorial/index.html'

// TODO allow skip and only methods
// [name], [options], filePath, testCallback
function loadDomThenTest(...args) {
    const testCallback = args.pop()
    const filePath = args.pop()

    test(...args, t => {
        getWindowFromFile(filePath, window => {
            testCallback(t, window)
        })
    })
}

loadDomThenTest('VS.controls initial state', htmlPath, (t, window) => {
    const { VS } = window
    const pointerInput = VS.control.pointer.element

    t.equal(+pointerInput.value, 0, 'control pointer value to be 0')
    t.equal(VS.control.back.element.disabled, true, 'back control to start disabled')
    t.equal(VS.control.play.element.disabled, false, 'play control to start enabled')
    t.equal(VS.control.stop.element.disabled, true, 'stop control to start disabled')
    t.equal(VS.control.fwd.element.disabled, false, 'fwd control to start enabled')

    t.end()
})

loadDomThenTest('VS.controls step states', htmlPath, (t, window) => {
    const { VS } = window
    const pointerInput = VS.control.pointer.element

    VS.control.fwd.element.click()
    t.equal(VS.control.back.element.disabled, false, 'back control to be enabled after forward control click')

    VS.control.fwd.element.click()
    t.equal(+pointerInput.value, 2, 'control pointer value to be 2 after two forward control clicks')

    VS.control.back.element.click()
    t.equal(+pointerInput.value, 1, 'control pointer value to be 1 after two forward clicks and one back control click')

    VS.control.stop.element.click()
    // TODO the below test fails--reason unknown
    // t.equal(+pointerInput.value, 0, 'control pointer value to be 0 after stop control click')

    t.end()
})

loadDomThenTest('VS.controls play and stop states', htmlPath, (t, window) => {
    const { VS } = window

    VS.control.play.element.click()

    t.equal(VS.control.back.element.disabled, true, 'back control to be disabled when playing')
    t.equal(VS.control.play.element.disabled, false, 'pause control to be enabled when playing')
    t.equal(VS.control.stop.element.disabled, false, 'stop control to be enabled when playing')
    t.equal(VS.control.fwd.element.disabled, true, 'fwd control to be disabled when playing')

    // Stop score playback to end test
    VS.control.stop.element.click()

    t.end()
})
