/**
 * Populate score
 */
VS.score.preroll = transitionTime;

/**
 * Fade text in and out
 */
var textEventList = [
    {
        duration: 0,
        action: makeTextToggler(false)
    },
    {
        duration: 3600,
        action: makeTextToggler(true)
    },
    {
        duration: 3600,
        action: makeTextToggler(false)
    }
];

var walkEventList = walkEvents.map(function(frame, frameIndex) {
    return {
        duration: frame.duration,
        action: updateSymbols,
        parameters: [600, frameIndex]
    };
});

var finalEventList = [
    {
        duration: 0,
        action: function() {}
    }
];

var eventList = [].concat(textEventList, walkEventList, finalEventList)
    .map(function(bar, i, list) {
        bar.time = list.slice(0, i).reduce(function(sum, bar2) {
            return sum += bar2.duration;
        }, 0);
        return bar;
    });

eventList.forEach(function(bar) {
    VS.score.add(bar.time, bar.action, bar.parameters);
});
