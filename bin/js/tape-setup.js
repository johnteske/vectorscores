const path = require('path')
const test = require('tape')
const { JSDOM, VirtualConsole } = require('jsdom')

function createDomTester(testMethod) {
    // [name], [options], filePath, testCallback
    return function(...args) {
        const testCallback = args.pop()
        const filePath = args.pop()

        testMethod(...args, t => {
            getWindowFromFile(filePath, window => {
                testCallback(t, window)
            })
        })
    }
}

const loadDomThenTest = createDomTester(test)
loadDomThenTest.only = createDomTester(test.only)
loadDomThenTest.skip = createDomTester(test.skip)

/**
 * Create DOM from file and call function
 * with window object when document is loaded
 */
function getWindowFromFile(filePath, onLoad) {
    const options = {
        resources: 'usable',
        runScripts: 'dangerously',
        virtualConsole: new VirtualConsole().sendTo(
            console,
            { omitJSDOMErrors: true }
        )
    }

    JSDOM.fromFile(path.resolve('.', filePath), options).then(dom => {
        const { window } = dom

        window.addEventListener('load', () => {
            onLoad(window)
        })
    })
}

module.exports = {
    test,
    loadDomThenTest,
    getWindowFromFile
}
