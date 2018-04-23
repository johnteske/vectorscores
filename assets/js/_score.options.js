VS.score.options = (function() {

    var options = {};
    var elements = {};

    return {
        // TODO opts are more like defaults
        add: function(key, opts, element) {
            options[key] = opts;
            elements[key] = element;
        },
        updateUI: function() {
            for (var key in elements) {
                elements[key].setValue(options[key]);
            }
        },
        setFromUI: function() {
            for (var key in options) {
                options[key] = elements[key].getValue();
            }
        },
        setFromQueryString: function() {
            for (var key in options) {
                options[key] = VS.getQueryString(key);
            }
            return options;
            // options.updateUI();
        },
        makeQueryString: function() {
            var params = [];

            for (var key in options) {
                params.push(key + '=' + options[key]);
            }

            return params.join('&');
        }
    };
})();
