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
