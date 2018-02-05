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
    var names = {
        sharps: [
            'C', 'C#', 'D', 'D#', 'E', 'F',
            'F#', 'G', 'G#', 'A', 'A#', 'B'
        ],
        flats: [
            'C', 'Db', 'D', 'Eb', 'E', 'F',
            'Gb', 'G', 'Ab', 'A', 'Bb', 'B'
        ]
    };

    var te = {
       10: 'T',
       11: 'E'
    };

    var ab = {
       10: 'A',
       11: 'B'
    };

    return function(integer, format, options) {
        var dict;

        if (format === 'name') {
            var name;
            dict = (options === 'flats') ? 'flats' : 'sharps';

            return names[dict][integer];
        } else {
            var pc = integer.toString();
            dict = (options === 'ab') ? ab : te;

            return pc.replace(/10|11/, function(matched) {
                return dict[matched];
            });
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
    if (transpose === 'random') {
        transpose = Math.floor(Math.random() * 12);
    } else {
        transpose = VS.mod(transpose, 12);
    }

    return pcset.map(function(pc) {
        return (+pc + transpose) % 12;
    });
};
