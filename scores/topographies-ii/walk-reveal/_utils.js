/**
 * x, y from i of row-major order
 */
function indexToPoint(i) {
    var y = Math.floor(i / score.width);
    var x = i - (y * score.width);

    return {
        x: x,
        y: y
    };
}

function xyToIndex(x, y) {
    return (x & (score.width - 1)) + (y & (score.width - 1)) * score.width;
}

function pointToIndex(point) {
    return xyToIndex(point.x, point.y);
}
