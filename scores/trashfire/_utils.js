export function buildArray(n, fn) {
    var array = [];

    for (var i = 0; i < n; i++) {
        array[i] = fn(i, n);
    }

    return array;
};

export function flatten(target, array) {
    return target.concat(array);
};

export function last(array) {
    return array.slice(-1)[0] || [];
};

export const lineGenerator = d3.line()
    .x(function(d) { return d[0]; })
    .y(function(d) { return d[1]; });

export function push(array, item) {
    return [].concat(array, item);
};

export function sum(a, b) {
    return a + b;
};
