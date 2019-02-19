/**
 * Factory function to create methods to add and trigger hooks
 * @param {array} keys : keys of hooks
 */
export const createHooks = function(keys) {

    var hooks = {};

    /**
     * Initialize dictionary
     */
    var dictionary = keys.reduce(function(target, key) {
        target[key] = [];
        return target;
    }, {});

    /**
     * Add hook
     * @param {string} hook : key of hook to add to
     * @param {function} fn : function to add to hook
     */
    hooks.add = function(hook, fn) {
        if (dictionary[hook]) {
            dictionary[hook].push(fn);
        } else {
            throw new Error('[hooks#add] ' + hook + ' is not a registered hook');
        }
    };

    /**
     * Call all functions for a given hook
     * @param {string} hook : key of hook to trigger
     * @param {array} args : array of arguments to apply
     */
    hooks.trigger = function(hook, args) {
        dictionary[hook].forEach(function(fn) {
            fn.apply(null, args);
        });
    };

    return Object.freeze(hooks);
};
