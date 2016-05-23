console.log("vectorscores loaded");

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// Returns a random number between min (inclusive) and max (exclusive)
function getRandExcl(min, max) {
    return Math.random() * (max - min) + min;
}

function getWeightedItem(itemArray, weightArray) {
    var totalWeight = weight.reduce( function(a,b) {return a + b;} );
    var randNum = getRandExcl(0, totalWeight);
    var weightSum = 0;

    for (var i = 0; i < itemArray.length; i++) {
        weightSum += weightArray[i];
        if (randNum <= weightSum) { return itemArray[i]; }
    }
}
