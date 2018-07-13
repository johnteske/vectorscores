function makeTrash(type, min, max) {
    return {
        id: VS.id(),
        size: VS.getRandIntIncl(min, max),
        type: type
    };
}

function last(array) {
    return array.slice(-1)[0] || [];
}

function push(array, item) {
    return [].concat(array, item);
}

function addTrash(acc, bar, fn) {
    var lastTrashList = last(acc);
    var newTrashList = push(lastTrashList, fn(bar));
    return push(acc, [newTrashList]);
}

function removeTrash(acc) {
    var lastTrashList = last(acc);
    var newTrashList = lastTrashList.slice(1);
    return push(acc, [newTrashList]);
}

function emptyTrash(acc) {
    return push(acc, [[]]);
}

function copyTrash(acc) {
    var lastTrashList = last(acc);
    return push(acc, [lastTrashList]);
}

/**
 * Fire/spike cycle
 */
function fireCycle() {

    // Build 3-5 flames
    var flames = buildArray(VS.getItem([3, 4, 5]), function(index, n) {
        var type = (index > 2) ? 'blaze' : 'crackle';

        return {
            duration: ((7 - index) * 1000), // duration: 7-2 seconds
            action: 'add',
            fn: trash.set,
            trashes: [
                makeTrash(type, 25, 25 + (index * (50 / n)))
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
                action: 'copy',
                fn: TrashFire.spike.show
            },
            {
                duration: 750,
                action: 'empty',
                fn: TrashFire.spike.hit
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
            action: 'add',
            fn: trash.set,
            trashes: [
                makeTrash('blaze', 25, 75)
            ]
        };
    }

    function embers() {
        var n = VS.getItem([1, 2, 3]);

        var grow = buildArray(n, function(i) {
            return {
                duration: ((7 - i) * 1000), // duration: 7-5 seconds
                action: 'add',
                fn: trash.set,
                trashes: [
                    makeTrash('embers', 25, 75)
                ]
            };
        });

        var die = buildArray(n, function(i, n) {
            return {
                duration: ((n - i + 4) * 1000),
                action: 'remove',
                fn: trash.set
            };
        });

        return [].concat(grow, die);
    }

    function multi() {
        var n = VS.getItem([1, 2, 3]);

        var trashes = buildArray(n, function() {
            return makeTrash('crackle', 25, 75);
        });

        // Add
        var add = {
            duration: 7000,
            action: 'add',
            fn: trash.set,
            trashes: trashes
        };

        // Then die away
        var dieAway = buildArray(n, function(i, n) {
            return {
                duration: ((n - i + 4) * 1000),
                action: 'remove',
                fn: trash.set
            };
        });

        return [].concat(add, dieAway);
    }

    // Empty trash
    var empty = {
        duration: 3000, // rest // TODO does this value even impact the phrasing?
        action: 'empty',
        fn: trash.set
    };

    var cycle = [].concat(flames, spikes, tail, empty);

    // TODO make the trashses here, then ZIP
    var trashes = cycle.reduce(function(acc, bar) {
        var actions = {
            add: addTrash,
            remove: removeTrash,
            empty: emptyTrash,
            copy: copyTrash
        };
        return actions[bar.action](acc, bar, function(bar) { return bar.trashes; });
    }, []);

    // Zip the events and trash together, then add time, for a valid VS.score event
    return cycle.map(function(d, i) {
        return {
            duration: d.duration,
            fn: d.fn,
            args: [1000, trashes[i]] // TODO default duration is 1s
        };
    })
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
    .reduce(flatten, []);

var lastTime = fireEvents[fireEvents.length - 1].time;
