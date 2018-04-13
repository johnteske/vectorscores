var path = require('path');
var test = require(path.resolve('.', 'bin/js/node_modules/tape'));
var JSDOM = require(path.resolve('.', 'bin/js/node_modules/jsdom')).JSDOM;
var fs = require('fs');
var html = fs.readFileSync(path.resolve('.', '_site/scores/tutorial/index.html'), 'utf8');
var DOM = new JSDOM(html);
global.window = DOM.window;
global.document = DOM.window.document;

var VS = require(path.resolve('.', '_site/assets/js/vectorscores.js'));

test('VS#clamp', function(t) {
    t.equal(VS.clamp(10, 0, 5), 5);
    t.end();
});
