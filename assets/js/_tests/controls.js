const path = require('path')
const { loadDomThenTest } = require(path.resolve('.', 'bin/js/tape-setup'))

const htmlPath = '_site/scores/tutorial/index.html'
const controlStates = require('../_control-states.json')

const controlsToCheckDisabled = ['back', 'stop', 'fwd']
const controlsToCheckClass = ['play', 'pause']

loadDomThenTest('VS.control states and pointer', htmlPath, (t, window) => {
    const { VS } = window

    function testControlState() {
        const result = {}

        controlsToCheckDisabled.forEach(function(controlName) {
            result[controlName] = !VS.control[controlName].disabled
        })

        controlsToCheckClass.forEach(function(controlName) {
            result[controlName] = VS.control.play.classList.contains(controlName)
        })

        return result
    }

    t.deepEqual(testControlState(VS), controlStates.firstStep, 'should show controls matching \'firstStep\' state on load')
    t.equal(+VS.control.pointer.value, 0, 'should show pointer at 0 on load')

    VS.control.play.click()
    t.deepEqual(testControlState(VS), controlStates.playing, 'should show controls matching \'playing\' state after playing')

    // Pause
    VS.control.play.click()
    t.deepEqual(testControlState(VS), controlStates.firstStep, 'should show controls matching \'firstStep\' state when paused on first score event')

    VS.control.fwd.click()
    t.deepEqual(testControlState(VS), controlStates.step, 'should show controls matching \'step\' state after clicking forward')
    t.equal(+VS.control.pointer.value, 1, 'should show pointer at 1 after clicking forward')

    VS.control.stop.click()
    t.deepEqual(testControlState(VS), controlStates.firstStep, 'should show controls matching \'firstStep\' state after stop')
    t.equal(+VS.control.pointer.value, 0, 'should show pointer at 0 after stop')

    t.end()
})
