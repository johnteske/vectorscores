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
 * TODO retrograde globjects for march section
 */
var retrogradeGlobjects = globjects.map(function(globject) {
    function mapTime(o) {
        var mapped = {
            value: o.value,
            time: 1 - o.time
        };
        return mapped;
    }

    var retrograde = {
        width: globject.width
    };

    retrograde.rangeEnvelope = {
        type: globject.rangeEnvelope.type,
        hi: globject.rangeEnvelope.hi.map(mapTime),
        lo: globject.rangeEnvelope.lo.map(mapTime)
    };

    return retrograde;
});
