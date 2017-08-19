var score = {% include_relative _score.json %};

score = score.map(function(mm) {
    for (var i = 0; i < mm.globjects.length; i++) {
        var globject = mm.globjects[i];

        /**
         * Normalize range values
         */
        var highs = globject.rangeEnvelope.hi,
            lows = globject.rangeEnvelope.lo,
            extent = d3.extent(highs.concat(lows));

        globject.rangeEnvelope.hi = highs.map(function(v) {
            return VS.normalize(v, extent[0], extent[1]);
        });

        globject.rangeEnvelope.lo = lows.map(function(v) {
            return VS.normalize(v, extent[0], extent[1]);
        });

        /**
         * Convert durations into times
         */
        var durs = globject.rangeEnvelope.durations;

        var totalDuration = durs.reduce(function(a, b) {
            return a + b;
        }, 0);

        var currentTime = 0;

        globject.rangeEnvelope.times = durs.map(function(dur) {
            return currentTime += dur / totalDuration;
        });
    }

    return mm.globjects;
});
