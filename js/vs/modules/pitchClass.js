---
layout: compress-js
---
/**
 * @param {Integer} integer - pitch class
 * @param {String} format - display format
 */
var pcFormat = (function() {
    var names = [
        "C", "C#", "D", "D#", "E", "F",
        "F#", "G", "G#", "A", "A#", "B"
    ];

    return function(integer, format) {
        if (format === "name") {
            return names[integer];
        } else {
            return integer;
        }
    };
})();

var pcsetTranspose = function(pcset, transpose) {
    var t = transpose !== "random" ? transpose : Math.floor(Math.random() * 12);
    return pcset.map(function(pc) {
        return (pc + t) % 12;
    })
}
