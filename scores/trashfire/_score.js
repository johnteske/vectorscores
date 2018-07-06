function sortByTime(a, b) {
    return a.time - b.time;
}

/**
 * Fire/spike cycle
 */
function addTrash(n, type, range) {
    while (n) {
        trash.add({
            size: VS.getRandExcl(range[0], range[1]),
            type: type
        });

        n--;
    }

    trash.update();
}

// TODO shift() would be useful but updateTrash does not properly join data
function removeTrash() {
    trash.remove();
    trash.update();
}

function emptyTrash() {
    trash.empty();
    trash.update();
}

function flatten(target, array) {
    return target.concat(array);
}

function buildArray(n, fn) {
    var array = [];

    for (var i = 0; i < n; i++) {
        array[i] = fn(i, n);
    }

    return array;
}

// NOTE this mutates its input
function addTimeFromDurations(currentBar, i, score) {
    currentBar.time = score.slice(0, i).reduce(function(sum, bar) {
        return sum += bar.duration;
    }, 0);

    return currentBar;
}

function fireCycle() {

    // Build 3-5 flames
    var flames = buildArray(VS.getItem([3, 4, 5]), function(index, n) {
        return {
            duration: ((7 - index) * 1000), // duration: 7-2 seconds
            fn: addTrash,
            args: [
                1,
                (index > 2) ? 'blaze' : 'crackle',
                [25, 25 + (index * (50 / n))]
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
            fn: addTrash,
            args: [1, 'blaze', [25, 75]]
        };
    }

    function embers() {
        var n = VS.getItem([1, 2, 3]);

        var grow = buildArray(n, function(i) {
            return {
                duration: ((7 - i) * 1000), // duration: 7-5 seconds
                fn: addTrash,
                args: [1, 'embers', [25, 75]]
            };
        });

        var die = buildArray(n, function(i, n) {
            return {
                duration: ((n - i + 4) * 1000),
                fn: removeTrash,
                args: []
            };
        });

        return [].concat(grow, die);
    }

    function multi() {
        var n = VS.getItem([1, 2, 3]);

        // Add
        var add = {
            duration: 7000,
            fn: addTrash,
            args: [n, 'crackle', [25, 75]]
        };

        // Then die away
        var dieAway = buildArray(n, function(i, n) {
            return {
                duration: ((n - i + 4) * 1000),
                fn: removeTrash,
                args: []
            };
        });

        return [].concat(add, dieAway);
    }

    // Empty trash
    var empty = {
        duration: 3000, // rest
        fn: emptyTrash,
        args: []
    };

    return [].concat(flames, spikes, tail, empty)
        .map(addTimeFromDurations);
}

function timeOffset(ms) {
    return function(bar) {
        bar.time += ms;
        return bar;
    };
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

console.log(fireEvents.map(function(c) { return c.time; }));

// var lastTime = fireEvents[fireEvents.length - 1].time;

// /**
//  * Noise
//  */
// var noiseEvents = (function() {
//     var noises = [],
//         timeWindow = lastTime / 5,
//         noiseTime;

//     for (var i = 0; i < 5; i++) {
//         noiseTime = (timeWindow * i) + (Math.random() * timeWindow);

//         noises.push({
//             time: noiseTime,
//             fn: TrashFire.noiseLayer.add,
//             args: [8, 200]
//         });
//         noises.push({
//             time: noiseTime + 1600 + (Math.random() * 1600),
//             fn: TrashFire.noiseLayer.remove,
//             args: [32]
//         });
//     }

//     return noises;
// }());

// /**
//  * Drone
//  */
// var droneEvents = (function() {
//     var drones = [],
//         timeWindow = lastTime / 3,
//         droneTime,
//         droneDur;

//     for (var i = 0; i < 3; i++) {
//         droneTime = (timeWindow * i) + (Math.random() * timeWindow);
//         // 50-75% drone
//         droneDur = (timeWindow * 0.5) + (Math.random() * (timeWindow * 0.25));

//         drones.push({
//             time: droneTime,
//             fn: TrashFire.scrapeDrone.show,
//             args: []
//         });
//         drones.push({
//             time: droneTime + droneDur,
//             fn: TrashFire.scrapeDrone.hide,
//             args: []
//         });
//     }

//     return drones;
// }());

/**
 * Sort score by event time
 */
// var score = [].concat(fireEvents, noiseEvents, droneEvents)
var score = [].concat(fireEvents)
    .sort(sortByTime);

score.forEach(function(bar) {
    VS.score.add(bar.time, bar.fn, bar.args);
});
