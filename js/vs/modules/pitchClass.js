---
layout: compress-js
---

VS.pitchClass = {};

/**
 * @param {Integer} integer - pitch class
 * @param {String} format - display format
 * @returns {String} formatted pitch class
 */
VS.pitchClass.format = (function() {
    var names = [
        "C", "C#", "D", "D#", "E", "F",
        "F#", "G", "G#", "A", "A#", "B"
    ];

    return function(integer, format) {
        if (format === "name") {
            return names[integer];
        } else {
            return integer.toString().replace("10", "T").replace("11", "E");
        }
    };
})();

/**
 * Transposes a set of pitch classes
 * @param {Array} pcset - array of pitch classes
 * @param {Integer} transpose - semitones to transpose by
 * @returns {Array} array of transposed pitch classes
*/
VS.pitchClass.transpose = function(pcset, transpose) {
    var t = transpose !== "random" ? transpose : Math.floor(Math.random() * 12);
    return pcset.map(function(pc) {
        return (+pc + t) % 12;
    });
};
