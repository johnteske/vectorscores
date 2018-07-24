/**
 * Populate score
 */
VS.score.preroll = transitionTime;

var addEvent = (function() {
    var time = 0;

    return function(fn, duration) {
        VS.score.add(time, fn);
        time += duration;
    };
})();

function randDuration() {
    return 1200; // 600 + (Math.random() * 600);
}

/**
 * Reveal a starting point, chosen from an extreme high or low
 */
(function() {
    var extremaIndices = topoData.reduce(function(indices, d, i) {
        ((d.height === score.range.min) || (d.height === score.range.max)) && indices.push(i);
        return indices;
    }, []);

    walker.index = VS.getItem(extremaIndices);

    topoData[walker.index].revealed = revealFactor;
    topoData[walker.index].walked = true;
}());

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

var walkEventList = [];
for (var i = 0; i < nEvents; i++) {
    walkEventList.push({
        duration: randDuration(),
        action: moveWalker
    });
}

var finalEventList = [
    {
        duration: 6000,
        action: function(duration) {
            forgetAll(duration || 6000);
        }
    },
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
    VS.score.add(bar.time, bar.action);
});
