/**
 * Factory function to add hooks to internal methods
 * Currently no method to remove at this time as
 * hooks are not dynamically added/removed
 * @param {array} keys : keys of hooks
 */
VS.createHooks = function(keys) {

    var hooks = {};

    /**
     * Initialize dictionary
     */
    var dictionary = {};

    for (var i = 0; i < keys.length; i++) {
        dictionary[keys[i]] = [];
    }

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
     */
    hooks.trigger = function(hook) {
        var fns = dictionary[hook];

        for (var i = 0; i < fns.length; i++) {
            fns[i]();
        }
    };

    return Object.freeze(hooks);
};
