var values = [];
var width = 8;
var height = 8;

var featuresize = 8;
var samplesize = featuresize;

var initScale = 3;
var scale = 3;

function frand() {
    return (Math.random() * 2) - 1;
}

for (var y = 0; y < height; y += featuresize) {
    for (var x = 0; x < width; x += featuresize)
    {
        setSample(x, y, frand() * scale);
    }
}

function sample(x, y) {
    return values[(x & (width - 1)) + (y & (height - 1)) * width];
}

function setSample(x, y, value) {
    value = VS.clamp(value, -initScale, initScale);
    values[(x & (width - 1)) + (y & (height - 1)) * width] = value;
}

function sampleSquare(x, y, size, value) {
    var hs = size / 2;

    var a = sample(x - hs, y - hs);
    var b = sample(x + hs, y - hs);
    var c = sample(x - hs, y + hs);
    var d = sample(x + hs, y + hs);

    setSample(x, y, ((a + b + c + d) / 4.0) + value);
}

function sampleDiamond(x, y, size, value) {
    var hs = size / 2;

    var a = sample(x - hs, y);
    var b = sample(x + hs, y);
    var c = sample(x, y - hs);
    var d = sample(x, y + hs);

    setSample(x, y, ((a + b + c + d) / 4.0) + value);
}

function DiamondSquare(stepSize, scale) {
    var x, y;
    var halfstep = stepSize / 2;

    for (y = halfstep; y < height + halfstep; y += stepSize)
    {
        for (x = halfstep; x < width + halfstep; x += stepSize)
        {
            sampleSquare(x, y, stepSize, frand() * scale);
        }
    }

    for (y = 0; y < height; y += stepSize)
    {
        for (x = 0; x < width; x += stepSize)
        {
            sampleDiamond(x + halfstep, y, stepSize, frand() * scale);
            sampleDiamond(x, y + halfstep, stepSize, frand() * scale);
        }
    }

}

while (samplesize > 1) {

    DiamondSquare(samplesize, scale);

    samplesize /= 2;
    scale /= 2.0;
}
