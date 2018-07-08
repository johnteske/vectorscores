function buildArray(n, fn) {
    var array = [];

    for (var i = 0; i < n; i++) {
        array[i] = fn(i, n);
    }

    return array;
}

var lineGenerator = d3.line()
    .x(function(d) { return d[0]; })
    .y(function(d) { return d[1]; });

function flatten(target, array) {
    return target.concat(array);
}

function sum(a, b) {
    return a + b;
}
