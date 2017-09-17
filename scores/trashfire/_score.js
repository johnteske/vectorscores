var score = [];

/**
 * Fire/spike cycle
 */
function addTrash(n, type, range) {
    for (var i = 0; i < n; i++) {
        trash.push({
            size: VS.getRandExcl(range[0], range[1]),
            type: type
        });
    }

    updateTrash();
}

// TODO shift() would be useful but updateTrash does not properly join data
function removeTrash() {
    trash.pop();
    updateTrash();
}

function emptyTrash() {
    trash = [];
    updateTrash();
}

function fireCycle() {
    var i = 0,
        cycle = [];

    // build fire, 3-5
    var nFires = Math.floor(VS.getRandExcl(3, 6));
    for (i = 0; i < nFires; i++) {
        cycle.push({
            time: time,
            fn: addTrash,
            args: [
                1,
                (i > 2) ? "blaze" : "crackle",
                [25, 25 + (i * (50 / nFires))]
            ]
        });

        time += ((7 - i) * 1000); // duration: 7-2 seconds
    }

    // hit dumpster, 0-3 times
    var nSpikes = VS.getWeightedItem([0, 1, 2, 3], [15, 60, 15, 10]);
    for (i = 0; i < nSpikes; i++) {
        cycle.push({
            time: time,
            fn: TrashFire.spike.show,
            args: []
        });
        cycle.push({
            time: time + 600, // show() duration
            fn: TrashFire.spike.hit,
            args: []
        });

        time += 1350; // show() + hit() duration
    }
    // TODO reduce trash to last 3 items if no spike?

    var tail = VS.getItem(["resume", "embers", "multi", ""]);
    var nTail = 0;
    switch (tail) {
        // come back stronger
        case "resume":
            // add
            cycle.push({
                time: time,
                fn: addTrash,
                args: [1, "blaze", [25, 75]]
            });
            time += 7000;

            break;
        // embers, 1-3
        case "embers":
            nTail = VS.getItem([1, 2, 3]);

            // grow
            for (i = 0; i < nTail; i++) {
                cycle.push({
                    time: time,
                    fn: addTrash,
                    args: [1, "embers", [25, 75]]
                });
                time += ((7 - i) * 1000); // duration: 7-5 seconds
            }

            // die away
            for (i = 0; i < nTail; i++) {
                cycle.push({
                    time: time,
                    fn: removeTrash,
                    args: []
                });
                time += ((nTail - i + 4) * 1000);
            }

            break;
        // multiple small fires, 1-3
        case "multi":
            nTail = VS.getItem([1, 2, 3]);

            // add all
            cycle.push({
                time: time,
                fn: addTrash,
                args: [nTail, "crackle", [25, 75]]
            });
            time += 7000;

            // die away
            for (i = 0; i < nTail; i++) {
                cycle.push({
                    time: time,
                    fn: removeTrash,
                    args: []
                });
                time += ((nTail - i + 4) * 1000);
            }

            break;
        // end cycle
        default:
            break;
    }

    // empty trash
    cycle.push({
        time: time,
        fn: emptyTrash,
        args: []
    });
    time += 3000; // rest

    return cycle;
}

// create base score from 5x fireCycle
var time = 0;
score = score.concat(fireCycle(), fireCycle(), fireCycle(), fireCycle(), fireCycle());

/**
 * Noise
 */
var lastTime = score[score.length - 1].time;
console.log(lastTime, lastTime / 60000);

var noiseEvents = (function() {
    var noises = [],
        timeWindow = lastTime / 5,
        noiseTime;

    for (var i = 0; i < 5; i++) {
        noiseTime = (timeWindow * i) + (Math.random() * timeWindow);

        noises.push({
            time: noiseTime,
            fn: TrashFire.noiseLayer.add,
            args: [8, 200]
        });
        noises.push({
            time: noiseTime + 1600 + (Math.random() * 1600),
            fn: TrashFire.noiseLayer.remove,
            args: [32]
        });
    }

    return noises;
}());

score = score.concat(noiseEvents);

/**
 * Sort score by event time
 */
score.sort(function (a, b) {
  return a.time - b.time;
});

for (var i = 0; i < score.length; i++) {
    var bar = score[i];
    VS.score.add(bar.time, bar.fn, bar.args);
}
