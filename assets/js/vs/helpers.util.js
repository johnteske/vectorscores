/**
 * Get query parameter value from query string, by query parameter key
 * @param {string} param : query parameter key
 * @param {string} [url=window.location.href] : URL string to extract query parameter value from
 * @returns {string} : query parameter value
 */
export function getQueryString(param, url) {
    var href = url || window.location.href;
    var match = new RegExp('[?&]' + param + '=([^&#]*)', 'i').exec(href);

    return match ? match[1] : null;
}

/**
 * Make query string
 * @param {object} params : query parameters as key-value pairs
 * @returns {string} : query string, joined by '&'
 */
export function makeQueryString(params) {
    return Object.keys(params).map(function(key) {
        return key + '=' + params[key];
    }).join('&');
}

/**
 * Define constant as function (used in D3-idiomatic modules)
 * @param {*} val : value to set as constant
 * @returns {*} : value
 */
export function constant(val) {
    return function constant() {
        return val;
    };
}

/**
 * Generate unique id
 * @returns {number} : id
 */
export const id = (function() {
    var id = 0;

    return function() {
        return id++;
    };
}());
