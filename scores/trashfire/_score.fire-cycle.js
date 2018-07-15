function makeTrash(type, min, max) {
    return {
        id: VS.id(),
        size: VS.getRandIntIncl(min, max),
        type: type
    };
}

function addTrash(acc, bar, fn) {
    var lastTrashList = TrashUtils.last(acc);
    var newTrashList = TrashUtils.push(lastTrashList, fn(bar));
    return TrashUtils.push(acc, [newTrashList]);
}

function removeTrash(acc) {
    var lastTrashList = TrashUtils.last(acc);
    var newTrashList = lastTrashList.slice(1);
    return TrashUtils.push(acc, [newTrashList]);
}

function emptyTrash(acc) {
    return TrashUtils.push(acc, [[]]);
}

function copyTrash(acc) {
    var lastTrashList = TrashUtils.last(acc);
    return TrashUtils.push(acc, [lastTrashList]);
}

/**
 * Fire/spike cycle
 */
function fireCycle() {

    // Build 3-5 flames
    var flames = TrashUtils.buildArray(VS.getItem([3, 4, 5]), function(index, n) {
        var type = (index > 2) ? 'blaze' : 'crackle';

        return {
            duration: ((7 - index) * 1000), // duration: 7-2 seconds
            action: 'add',
            fn: trash.set,
            transitionDuration: 1000,
            trashes: [
                makeTrash(type, 25, 25 + (index * (50 / n)))
            ]
        };
    });

    // Hit dumpster, 0-3 times
    // TODO reduce trash to last 3 items if no spike?
    var nSpikes = VS.getWeightedItem([0, 1, 2, 3], [15, 60, 15, 10]);
    var spikes = TrashUtils.buildArray(nSpikes, function() {
        return [
            {
                duration: 600,
                action: 'copy',
                fn: TrashFire.spike.show,
                transitionDuration: 600
            },
            {
                duration: 750,
                action: 'empty',
                fn: TrashFire.spike.hit,
                transitionDuration: 750
            }
        ];
    })
    .reduce(TrashUtils.flatten, []);

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
            transitionDuration: 1000,
            trashes: [
                makeTrash('blaze', 25, 75)
            ]
        };
    }

    function embers() {
        var n = VS.getItem([1, 2, 3]);

        var grow = TrashUtils.buildArray(n, function(i) {
            return {
                duration: ((7 - i) * 1000), // duration: 7-5 seconds
                action: 'add',
                fn: trash.set,
                transitionDuration: 1000,
                trashes: [
                    makeTrash('embers', 25, 75)
                ]
            };
        });

        var die = TrashUtils.buildArray(n, function(i, n) {
            return {
                duration: ((n - i + 4) * 1000),
                action: 'remove',
                fn: trash.set,
                transitionDuration: 1000
            };
        });

        return [].concat(grow, die);
    }

    function multi() {
        var n = VS.getItem([1, 2, 3]);

        var trashes = TrashUtils.buildArray(n, function() {
            return makeTrash('crackle', 25, 75);
        });

        // Add
        var add = {
            duration: 7000,
            action: 'add',
            fn: trash.set,
            transitionDuration: 1000,
            trashes: trashes
        };

        // Then die away
        var dieAway = TrashUtils.buildArray(n, function(i, n) {
            return {
                duration: ((n - i + 4) * 1000),
                action: 'remove',
                fn: trash.set,
                transitionDuration: 1000
            };
        });

        return [].concat(add, dieAway);
    }

    // Empty trash
    var empty = {
        duration: 3000,
        action: 'empty',
        fn: trash.set,
        transitionDuration: 1000
    };

    var cycle = [].concat(flames, spikes, tail, empty);

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
            args: [d.transitionDuration, trashes[i]]
        };
    })
    .map(addTimeFromDurations);
}

var fireEvents = TrashUtils.buildArray(5, fireCycle)
    .map(function(cycle, i, cycles) {
        if (i === 0) {
            return cycle;
        }

        var previousCycle = cycles[i - 1];
        var lastBarPreviousCycle = previousCycle[previousCycle.length - 1];
        var offset = lastBarPreviousCycle.time + lastBarPreviousCycle.duration;

        return cycle.map(timeOffset(offset));
    })
    .reduce(TrashUtils.flatten, []);

var lastTime = fireEvents[fireEvents.length - 1].time;
