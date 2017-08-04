// TODO rename properties, definitely rename properties.terms
var properties = {
    keys: [],
    terms: []
};

function makePropertyObj(key, keys) {
    var property = {
        keys: keys,
        weights: []
    };

    for (var i = 0; i < keys.length; i++) {
        property.weights.push(1);
    }

    properties.keys.push(key);
    properties.terms[key] = property;

    return property;
}

function createChoice() {
    var choice = {};

    for (var i = 0; i < properties.keys.length; i++) {
        var key = properties.keys[i];
        choice[key] = VS.getWeightedItem(properties.terms[key].keys, properties.terms[key].weights);
    }

    return choice;
}

function updateWeights(choice) {
    for (var i = 0; i < properties.keys.length; i++) {
        var key = properties.keys[i];
        var term = properties.terms[key];
        term.weights[term.keys.indexOf(choice[key])] += 1;
    }
}
