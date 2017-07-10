// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// Returns a random number between min (inclusive) and max (exclusive)
VS.getRandExcl = function(min, max) {
    return Math.random() * (max - min) + min;
};

VS.getItem = function(array) {
    return array[Math.floor(Math.random() * array.length)];
};

VS.getWeightedItem = function(itemArray, weightArray) {
    var totalWeight = weightArray.reduce( function(a, b) {return a + b;} ),
        randNum = VS.getRandExcl(0, totalWeight),
        weightSum = 0;

    for (var i = 0; i < itemArray.length; i++) {
        weightSum += weightArray[i];
        if (randNum <= weightSum) { return itemArray[i]; }
    }
};

VS.getQueryString = function(field, url) {
    var href = url ? url : window.location.href,
        string = new RegExp( "[?&]" + field + "=([^&#]*)", "i" ).exec(href);
    return string ? string[1] : null;
};

VS.clamp = function(val, min, max) {
    return Math.min(Math.max(val, min), max);
};
