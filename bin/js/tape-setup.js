const path = require('path')
const { JSDOM } = require('jsdom')

/**
 * Create DOM from file and call function
 * with window object when document is loaded
 */
function getWindowFromFile(filePath, onLoad) {
    const options = {
        resources: 'usable',
        runScripts: 'dangerously'
    }

    JSDOM.fromFile(path.resolve('.', filePath), options).then(dom => {
        const window = dom.window

        window.addEventListener('load', () => {
            onLoad(window)
        })
    })
}

module.exports = {
    test: require('tape'),
    getWindowFromFile
}
