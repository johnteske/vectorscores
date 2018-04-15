/**
 * Wrapper to execute a callback, if it exists and is a function
 * @param {function} callback
 */
VS.cb = function(callback) {
    if (typeof callback === 'function') {
        callback();
    }
};

/**
 * Get query parameter value from query string, by query parameter key
 * @param {string} param : query parameter key
 * @param {string} [url=window.location.href] : URL string to extract query parameter value from
 * @returns {string} : query parameter value
 */
VS.getQueryString = function(param, url) {
    var href = url ? url : window.location.href,
        string = new RegExp('[?&]' + param + '=([^&#]*)', 'i').exec(href);

    return string ? string[1] : null;
};

/**
 * Make query string
 * @param {object} params : query parameters as key-value pairs
 * @returns {string} : query string, joined by '&'
 */
VS.makeQueryString = function(params) {
    return Object.keys(params).map(function(key) {
        return key + '=' + params[key];
    }).join('&');
};

/**
 * Define constant as function (used in D3-idiomatic modules)
 * @param {*} val : value to set as constant
 * @returns {*} : value
 */
VS.constant = function(val) {
    return function constant() {
        return val;
    };
};
