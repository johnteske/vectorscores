/**
 * Space items in a selection by an array of durations
 * @param {D3Selection} selection
 * @param {Array} durations - an array of numbers, i.e. [1, 0.5, 0.25]
 * @param {Float} spacingUnit - unit to scale by, in px
 * @param {Float} padding - space between items, in px
 * @returns {D3Selection}
 */
VS.xByDuration = function(selection, durations, spacingUnit, padding) {
    var unit = spacingUnit || 10,
        pad = padding || 1;

    selection.attr("x", function (d, i) {
        var upToI = durations.slice(0, i),
            sum = upToI.reduce(function(a, b) {
                return a + b + pad;
            }, 0);
        return sum * unit;
    });
};
