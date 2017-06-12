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
