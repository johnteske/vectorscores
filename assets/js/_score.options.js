VS.score.options = (function() {

    var options = {};
    var elements = {};

    function updateElements() {
        for (var key in elements) {
            elements[key].setValue(options[key]);
        }
    }

    return {
        add: function(key, defaults, element) {
            options[key] = defaults;
            elements[key] = element;
        },
        setFromQueryString: function() {
            var value;

            for (var key in options) {
                value = VS.getQueryString(key);

                if (value) {
                    options[key] = value;
                }
            }

            updateElements();

            return options;
        }
    };
})();
