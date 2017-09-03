/**
 * TODO proto globjects are combined into phrases, not directly used
 */
var globjects = {% include_relative _globjects.json %};

var score = globjects.map(function(globject) {
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
console.log(score);
