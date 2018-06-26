const path = require('path')
const { test, getWindowFromFile } = require(path.resolve('.', 'bin/js/tape-setup'))

test('VS#controls initial state', t => {
    getWindowFromFile('_site/scores/tutorial/index.html', loadedWindow => {

        const { VS } = loadedWindow
        const pointerInput = VS.control.pointer.element

        t.equal(+pointerInput.value, 0, 'control pointer value to be 0')
        t.equal(VS.control.back.element.disabled, true, 'back control to start disabled')
        t.equal(VS.control.play.element.disabled, false, 'play control to start enabled')
        t.equal(VS.control.stop.element.disabled, true, 'stop control to start disabled')
        t.equal(VS.control.fwd.element.disabled, false, 'fwd control to start enabled')

        t.end()
    })
})

test('VS#controls step states', t => {
    getWindowFromFile('_site/scores/tutorial/index.html', loadedWindow => {

        const { VS } = loadedWindow
        const pointerInput = VS.control.pointer.element

        VS.control.fwd.element.click()
        t.equal(VS.control.back.element.disabled, false, 'back control to be enabled after forward control click')

        VS.control.fwd.element.click()
        t.equal(+pointerInput.value, 2, 'control pointer value to be 2 after two forward control clicks')

        VS.control.back.element.click()
        t.equal(+pointerInput.value, 1, 'control pointer value to be 1 after two forward clicks and one back control click')

        VS.control.stop.element.click()
        t.equal(+pointerInput.value, 0, 'control pointer value to be 0 after stop control click')

        t.end()
    })
})

test('VS#controls play and pause states', t => {
    getWindowFromFile('_site/scores/tutorial/index.html', loadedWindow => {

        const { VS } = loadedWindow

        VS.control.play.element.click()

        t.equal(VS.control.back.element.disabled, true, 'back control to be disabled when playing')
        t.equal(VS.control.play.element.disabled, false, 'pause control to be enabled when playing')
        t.equal(VS.control.stop.element.disabled, false, 'stop control to be enabled when playing')
        t.equal(VS.control.fwd.element.disabled, true, 'fwd control to be disabled when playing')

        // Stop score playback to end test
        VS.control.stop.element.click()

        t.end()
    })
})
