function generateGlobjects(rawGlobjects) {
    return rawGlobjects.map(function(rawGlobject) {
        var globject = {
            contour: rawGlobject.contour,
            rangeEnvelope: rawGlobject.rangeEnvelope
        };

        var highs = globject.rangeEnvelope.hi;
        var lows = globject.rangeEnvelope.lo;

        // NOTE highs and lows totalDurations should match
        var totalDuration = highs.reduce(function(sum, point) {
            return sum + point.duration;
        }, 0);

        /**
         * Normalize range values
         */
        var extent = d3.extent(highs.concat(lows), function(d) { return d.value; });

        function mapRangeEnvelope(envelope) {
            var currentTime = 0;

            return envelope.map(function(point) {
                point.value = VS.normalize(point.value, extent[0], extent[1]);
                point.time = currentTime;
                currentTime += point.duration / totalDuration;
                return point;
            });
        }

        highs = mapRangeEnvelope(highs);
        lows = mapRangeEnvelope(lows);

        globject.rangeEnvelope.type = 'normalized';

        /**
         * Remove duplicate points for smooth globject curve
         * In this case, both the hi and lo ranges match on start and end
         */
        globject.rangeEnvelope.lo = globject.rangeEnvelope.lo.slice(1, -1);

        return globject;
    });
}

function generateRetrogradeGlobjects(generatedGlobjects) {
    return generatedGlobjects.map(function(globject) {
        function mapRetrogradeTime(point) {
            var mapped = {
                value: point.value,
                time: 1 - point.time
            };
            return mapped;
        }

        var retrograde = {};

        retrograde.rangeEnvelope = {
            type: globject.rangeEnvelope.type,
            hi: [].concat(globject.rangeEnvelope.hi).map(mapRetrogradeTime),
            lo: [].concat(globject.rangeEnvelope.lo).map(mapRetrogradeTime)
        };

        return retrograde;
    });
}
