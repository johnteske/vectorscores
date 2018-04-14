VS.getRandExcl = function(min, max) {
    return Math.random() * (max - min) + min;
};

VS.getItem = function(items) {
    return items[Math.floor(Math.random() * items.length)];
};

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
 * Get query parameter value from query string, by query parameter key
 * @param {string} param - query parameter key
 * @param {string} [url=window.location.href] - URL string to extract query parameter value from
 */
VS.getQueryString = function(param, url) {
    var href = url ? url : window.location.href,
        string = new RegExp('[?&]' + param + '=([^&#]*)', 'i').exec(href);

    return string ? string[1] : null;
};

VS.makeQueryString = function(params) {
    return Object.keys(params).map(function(key) {
        return key + '=' + params[key];
    }).join('&');
};

VS.clamp = function(val, min, max) {
    return Math.min(Math.max(val, min), max);
};

VS.normalize = function(val, min, max) {
    return (val - min) / (max - min);
};

VS.constant = function(val) {
    return function constant() {
        return val;
    };
};

VS.mod = function(val, mod) {
    return ((val % mod) + mod) % mod;
};
