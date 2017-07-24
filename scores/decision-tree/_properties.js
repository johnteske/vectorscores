function makePropertyObj(symbols) {
    var keys = [],
        weights = [];

    for (var prop in symbols) {
        if (symbols.hasOwnProperty(prop)) {
            keys.push(prop);
            weights.push(1);
        }
    }

    return {
        symbols: symbols,
        keys: keys,
        weights: weights
    };
}
