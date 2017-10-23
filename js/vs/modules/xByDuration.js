---
layout: compress-js
---
/**
 * Space items in a selection by an array of durations
 * @param {D3Selection} selection
 * @param {Array} durations - an array of numbers, i.e. [1, 0.5, 0.25]
 * @param {Float} spacingUnit - unit to scale by, in px
 * @param {Float} padding - space between items, in px
 * @returns {D3Selection}
 */
VS.xByDuration = function(selection, durations, spacingUnit) {
    var unit = spacingUnit || 10;

    selection.attr("x", function(d, i) {
        var upToI = durations.slice(0, i),
            sum = upToI.reduce(function(a, b) {
                return a + b;
            }, 0);
        return sum * unit;
    });
};
