/**
 * @returns {Array} - row-major order data
 */
var topography = (function generateValues() {
    var values = [];
    var width = score.width;
    var height = score.width;

    var featureSize = 4;
    var sampleSize = featureSize;

    var scale = 4;

    function frand() {
        return (Math.random() * 2) - 1;
    }

    for (var y = 0; y < height; y += featureSize) {
        for (var x = 0; x < width; x += featureSize) {
            setSample(x, y, frand() * scale);
        }
    }

    function sample(x, y) {
        return values[xyToIndex(x, y)];
    }

    function setSample(x, y, value) {
        values[xyToIndex(x, y)] = value;
    }

    function sampleSquare(x, y, size, value) {
        var half = size / 2;

        var a = sample(x - half, y - half);
        var b = sample(x + half, y - half);
        var c = sample(x - half, y + half);
        var d = sample(x + half, y + half);

        setSample(x, y, ((a + b + c + d) / 4.0) + value);
    }

    function sampleDiamond(x, y, size, value) {
        var half = size / 2;

        var a = sample(x - half, y);
        var b = sample(x + half, y);
        var c = sample(x, y - half);
        var d = sample(x, y + half);

        setSample(x, y, ((a + b + c + d) / 4.0) + value);
    }

    function diamondSquare(stepSize, scale) {
        var x, y;
        var halfStep = stepSize / 2;

        for (y = halfStep; y < height + halfStep; y += stepSize) {
            for (x = halfStep; x < width + halfStep; x += stepSize) {
                sampleSquare(x, y, stepSize, frand() * scale);
            }
        }

        for (y = 0; y < height; y += stepSize) {
            for (x = 0; x < width; x += stepSize) {
                sampleDiamond(x + halfStep, y, stepSize, frand() * scale);
                sampleDiamond(x, y + halfStep, stepSize, frand() * scale);
            }
        }
    }

    while (sampleSize > 1) {
        diamondSquare(sampleSize, scale);
        sampleSize /= 2;
        scale /= 2.0;
    }

    return values;
})();
