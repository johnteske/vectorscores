var params = (function() {
    var params = {
        keys: [],
        data: []
    };

    params.add = function(key, keys) {
        var property = {
            keys: [],
            weights: []
        };

        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];

            property.keys.push(k.toString());
            property.weights.push(1);
        }

        params.keys.push(key);
        params.data[key] = property;

        return property;
    };

    params.createChoice = function() {
        var choice = {};

        for (var i = 0; i < params.keys.length; i++) {
            var key = params.keys[i];
            choice[key] = VS.getWeightedItem(params.data[key].keys, params.data[key].weights);
        }

        return choice;
    };

    params.updateWeights = function(choice, increment) {
        for (var i = 0; i < params.keys.length; i++) {
            var key = params.keys[i];
            var data = params.data[key];
            if (choice[key]) {
                data.weights[data.keys.indexOf(choice[key])] += increment;
            }
        }
    };

    params.getWeights = function() {
        var weights = "";

        for (var i = 0; i < params.keys.length; i++) {
            var key = params.keys[i];
            var data = params.data[key];

            weights += key + ": " + data.weights + "\n";
        }

        return weights;
    };

    return params;
})();
