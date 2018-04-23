VS.score.options = (function() {

    var options = {};
    var elements = {};

    function updateElements() {
        for (var key in elements) {
            elements[key].setValue(options[key]);
        }
    }

    // TODO this currently relies on a default being set for objects
    function setFromObject(obj) {
        var value;

        for (var key in obj) {
            // Add values from nested objects
            if (typeof obj[key] === 'object') {
                setFromObject(obj[key]);
            } else {
                value = VS.getQueryString(key);
                if (value) {
                    obj[key] = value;
                }
            }
        }
    }

    return {
        add: function(key, defaults, element) {
            options[key] = defaults;
            elements[key] = element;
        },
        setFromQueryString: function() {
            setFromObject(options);
            updateElements();

            return options;
        }
    };
})();
