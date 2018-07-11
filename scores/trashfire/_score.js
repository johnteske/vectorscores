// NOTE this mutates its input
function addTimeFromDurations(currentBar, i, score) {
    currentBar.time = score.slice(0, i).reduce(function(sum, bar) {
        return sum += bar.duration;
    }, 0);

    return currentBar;
}

function timeOffset(ms) {
    return function(bar) {
        bar.time += ms;
        return bar;
    };
}

function timeWindowOffset(endTime) {
    return function(d, i, list) {
        var timeWindow = Math.floor(endTime / list.length);
        var offset = (timeWindow * i) + VS.getRandIntIncl(0, timeWindow);

        return d.map(timeOffset(offset));
    };
}

function sortByTime(a, b) {
    return a.time - b.time;
}

/**
 * Sort score by event time
 */
var score = [].concat(fireEvents, noiseEvents, droneEvents)
    .sort(sortByTime);

score.forEach(function(bar) {
    VS.score.add(bar.time, bar.fn, bar.args);
});
