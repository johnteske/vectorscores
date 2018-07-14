var TrashUtils = {};

TrashUtils.buildArray = function(n, fn) {
    var array = [];

    for (var i = 0; i < n; i++) {
        array[i] = fn(i, n);
    }

    return array;
};

TrashUtils.flatten = function(target, array) {
    return target.concat(array);
};

TrashUtils.last = function(array) {
    return array.slice(-1)[0] || [];
};

TrashUtils.lineGenerator = d3.line()
    .x(function(d) { return d[0]; })
    .y(function(d) { return d[1]; });

TrashUtils.push = function(array, item) {
    return [].concat(array, item);
};

TrashUtils.sum = function(a, b) {
    return a + b;
};
