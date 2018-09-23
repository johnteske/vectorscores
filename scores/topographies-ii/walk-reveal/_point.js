function shift(axis, step) {
    return function(point) {
        var newPoint = {
            x: point.x,
            y: point.y
        };
        newPoint[axis] += step;
        return newPoint;
    };
}

function compose(f, g) {
    return function(x) {
        return f(g(x));
    };
}

var west = shift('x', -1);
var east = shift('x', 1);
var north = shift('y', -1);
var south = shift('y', 1);

var northWest = compose(north, west);
var southEast = compose(south, east);
