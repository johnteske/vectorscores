function makeTrash(type, range) {
    return {
        id: VS.id(),
        size: VS.getRandIntIncl(range[0], range[1]),
        type: type
    };
}

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

function sortByTime(a, b) {
    return a.time - b.time;
}

/**
 * Fire/spike cycle
 */
function fireCycle() {

    // Build 3-5 flames
    var flames = buildArray(VS.getItem([3, 4, 5]), function(index, n) {
        var type = (index > 2) ? 'blaze' : 'crackle';
        var range = [25, 25 + (index * (50 / n))];

        return {
            duration: ((7 - index) * 1000), // duration: 7-2 seconds
            fn: trash.add,
            args: [
                makeTrash(type, range)
            ]
        };
    });

    // Hit dumpster, 0-3 times
    // TODO reduce trash to last 3 items if no spike?
    var nSpikes = VS.getWeightedItem([0, 1, 2, 3], [15, 60, 15, 10]);
    var spikes = buildArray(nSpikes, function() {
        return [
            {
                duration: 600,
                fn: TrashFire.spike.show,
                args: []
            },
            {
                duration: 750,
                fn: TrashFire.spike.hit,
                args: []
            }
        ];
    })
    .reduce(flatten, []);

    var tailType = VS.getItem(['resume', 'embers', 'multi', '']);
    var tailFns = {
        'resume': resume,
        'embers': embers,
        'multi': multi
    };
    var tail = (tailType !== '') ? tailFns[tailType]() : [];

    // Come back stronger
    function resume() {
        return {
            duration: 7000,
            fn: trash.add,
            args: [
                makeTrash('blaze', [25, 75])
            ]
        };
    }

    function embers() {
        var n = VS.getItem([1, 2, 3]);

        var grow = buildArray(n, function(i) {
            return {
                duration: ((7 - i) * 1000), // duration: 7-5 seconds
                fn: trash.add,
                args: [
                    makeTrash('embers', [25, 75])
                ]
            };
        });

        var die = buildArray(n, function(i, n) {
            return {
                duration: ((n - i + 4) * 1000),
                fn: trash.remove,
                args: []
            };
        });

        return [].concat(grow, die);
    }

    function multi() {
        var n = VS.getItem([1, 2, 3]);

        var trashes = buildArray(n, function() {
            return makeTrash('crackle', [25, 75]);
        });

        // Add
        var add = {
            duration: 7000,
            fn: trash.add,
            args: [trashes]
        };

        // Then die away
        var dieAway = buildArray(n, function(i, n) {
            return {
                duration: ((n - i + 4) * 1000),
                fn: trash.remove,
                args: []
            };
        });

        return [].concat(add, dieAway);
    }

    // Empty trash
    var empty = {
        duration: 3000, // rest
        fn: trash.empty,
        args: []
    };

    return [].concat(flames, spikes, tail, empty)
        .map(addTimeFromDurations);
}

var fireEvents = buildArray(5, fireCycle)
    .map(function(cycle, i, cycles) {
        if (i === 0) {
            return cycle;
        }

        var previousCycle = cycles[i - 1];
        var offset = previousCycle[previousCycle.length - 1].time + 3000;

        return cycle.map(timeOffset(offset));
    })
    .reduce(flatten);

var lastTime = fireEvents[fireEvents.length - 1].time;

/**
 * Noise
 */
var noiseEvents = buildArray(5, function(i) {
    var timeWindow = lastTime / 5;
    var time = (timeWindow * i) + VS.getRandIntIncl(0, timeWindow);
    var duration = VS.getRandIntIncl(1600, 3200);

    return [{
        time: time,
        fn: TrashFire.noiseLayer.add,
        args: [8]
    },
    {
        time: time + duration,
        fn: TrashFire.noiseLayer.remove,
        args: [32]
    }];

})
.reduce(flatten);

/**
 * Drone
 */
var droneEvents = buildArray(3, function(i) {
    var timeWindow = lastTime / 3;
    // Start anywhere in window
    var time = (timeWindow * i) + VS.getRandIntIncl(0, timeWindow);
    // Drone for 50-75% of window
    var duration = timeWindow * VS.getRandIntIncl(0.5, 0.75);

    return [
        {
            time: time,
            fn: TrashFire.scrapeDrone.show,
            args: []
        },
        {
            time: time + duration,
            fn: TrashFire.scrapeDrone.hide,
            args: []
        }
    ];
})
.reduce(flatten);

/**
 * Sort score by event time
 */
var score = [].concat(fireEvents, noiseEvents, droneEvents)
    .sort(sortByTime);

score.forEach(function(bar) {
    VS.score.add(bar.time, bar.fn, bar.args);
});
