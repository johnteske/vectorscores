/**
 * TODO proto globjects are combined into phrases, not directly used
 */
var globjects = {% include_relative _globjects.json %};

globjects = globjects.map(function(globject) {
    var highs = globject.rangeEnvelope.hi,
        lows = globject.rangeEnvelope.lo;

    // TODO hi and lo totalDurations should match
    var totalDuration = highs.reduce(function(a, o) {
        return a + o.duration;
    }, 0);

    var currentTime;

    /**
     * Normalize range values
     */
    var extent = d3.extent(highs.concat(lows), function(d) { return d.value; });

    currentTime = 0;
    globject.rangeEnvelope.hi = highs.map(function(o) {
        o.value = VS.normalize(o.value, extent[0], extent[1]);
        o.time = currentTime;
        currentTime += o.duration / totalDuration;
        return o;
    });

    currentTime = 0;
    globject.rangeEnvelope.lo = lows.map(function(o) {
        o.value = VS.normalize(o.value, extent[0], extent[1]);
        o.time = currentTime;
        currentTime += o.duration / totalDuration;
        return o;
    });

    return globject;
});

/**
 * TODO Invert globjects for march section
 */
// var invertedGlobjects = globjects.map(function(globject) {
// });

/**
 *
 */
var score = [];

// dirge
for (var i = 0; i < 3; i++) {
    var desc = VS.getItem(globjects.filter(function(g) {
        return g.contour === "descending";
    }));

    score.push(desc);
}

//
score.push(VS.getItem(globjects.filter(function(g) {
    return g.contour === "ascending";
})));

// march
for (var i = 0; i < 3; i++) {
    score.push(VS.getItem(globjects));
}
