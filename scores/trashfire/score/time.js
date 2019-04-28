// NOTE this mutates its input
export function addTimeFromDurations(currentBar, i, score) {
    currentBar.time = score.slice(0, i).reduce(function(sum, bar) {
        return sum += bar.duration;
    }, 0);

    return currentBar;
}

export function timeOffset(ms) {
    return function(bar) {
        bar.time += ms;
        return bar;
    };
}

export function timeWindowOffset(endTime) {
    return function(d, i, list) {
        var timeWindow = Math.floor(endTime / list.length);
        var offset = (timeWindow * i) + VS.getRandIntIncl(0, timeWindow);

        return d.map(timeOffset(offset));
    };
}
