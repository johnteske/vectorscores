/**
 * Helper for intializing tests and JSDOM
 */
function setupDOM(filePath) {
    const path = require('path')
    const fs = require('fs')

    const JSDOM = require('jsdom').JSDOM
    const html = fs.readFileSync(path.resolve('.', filePath), 'utf8')
    const DOM = new JSDOM(html)

    global.window = DOM.window
    global.document = DOM.window.document

    return DOM
}

module.exports = {
    test: require('tape'),
    setupDOM
}
