/**
 *
 */
function getScoreRange(data) {
    return {
        min: Math.min.apply(null, data),
        max: Math.max.apply(null, data)
    };
}

/**
 * Assign properties to row-major order data
 */
function createScoreFragment(data) {
    return data.map(function(d) {
        return {
            height: d,
            heightIndex: ~~d,
            revealed: 0
        };
    });
}
