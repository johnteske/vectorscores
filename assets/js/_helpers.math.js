/**
 * Get random float between min and max, excluding max
 * @param {number} min : lower limit
 * @param {number} max : upper limit (excluded)
 * @returns {number} float value between min and max, excluding max
 */
VS.getRandExcl = function(min, max) {
    return Math.random() * (max - min) + min;
};

/**
 * Get random integer, inclusive
 * NOTE expects integer input
 * @param {number} min : lower limit
 * @param {number} max : upper limit (included)
 * @returns {number} integer value between min and max, including max
 */
VS.getRandIntIncl = function(min, max) {
    return Math.floor(VS.getRandExcl(min, max + 1));
};

/**
 * Get random item from an array, using uniform distribution
 * @param {array} items
 * @returns {*}
 */
VS.getItem = function(items) {
    return items[Math.floor(Math.random() * items.length)];
};

/**
 * Get random item from an array, using weighted distribution
 * @param {array} items
 * @returns {*}
 */
VS.getWeightedItem = function(items, weights) {
    var totalWeight = weights.reduce(function(a, b) {
        return a + b;
    });

    var rand = VS.getRandExcl(0, totalWeight);

    for (var i = 0, acc = 0; i < items.length; i++) {
        acc += weights[i];

        if (rand <= acc) {
            return items[i];
        }
    }
};

/**
 * Constrain a value to the specified limits
 * @param {number} val
 * @param {number} min
 * @param {number} val
 * @returns {number}
 */
VS.clamp = function(val, min, max) {
    return Math.min(Math.max(val, min), max);
};

/**
 * Normalize a value with the specified limits
 * @param {number} val
 * @param {number} min
 * @param {number} val
 * @returns {number}
 */
VS.normalize = function(val, min, max) {
    return (val - min) / (max - min);
};

/**
 * Modulo function
 * @param {number} val
 * @param {number} mod
 * @returns {number}
 */
VS.mod = function(val, mod) {
    return ((val % mod) + mod) % mod;
};
