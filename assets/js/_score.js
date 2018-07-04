VS.score = (function() {

    var events = [];

    var allTimeouts = [];
    function clearAllTimeouts() {
        allTimeouts.forEach(function(t) {
            clearTimeout(t);
        });
    }

    var isPlaying = false;
    var pointer = 0;

    // Schedule this event (if defined)
    function schedule(time, func, params) {
        (typeof func === 'function') && allTimeouts.push(setTimeout(func, time, params));
    }

    // Add a hook for the stop event, triggered after a score ends or by the user
    var hooks = VS.createHooks(['stop']);

    function updatePointer(index) {
        pointer = index;
        VS.control.pointer.value = index;
    }

    function playEvent(index) {
        VS.score.updatePointer(index);

        var thisEvent = events[index];

        // Execute this event (if defined)
        if (typeof thisEvent.action === 'function') {
            // TODO don't force first argument to be index
            thisEvent.action.apply(null, thisEvent.parameters);
        }

        // Schedule next event
        if (index < VS.score.getLength() - 1) {
            var timeToNext = events[index + 1].time - thisEvent.time;
            schedule(timeToNext, playEvent, index + 1);
        } else {
            VS.score.stop(); // TODO should the score automatically stop? or should the composer call this when ready?
        }
    }

    return {
        add: function(time, fn, parameters) {
            events.push({
                time: time,
                action: fn,
                parameters: parameters
            });
        },
        getLength: function() { return events.length; },
        isPlaying: function() { return isPlaying; },
        getPointer: function() { return pointer; },
        pointerAtLastEvent: function() {
            return pointer === (this.getLength() - 1);
        },
        preroll: 0, // delay before play
        hooks: hooks,
        play: function() {
            isPlaying = true;
            schedule(VS.score.preroll, playEvent, pointer);
            VS.control.set('playing');
            VS.layout.hide();
        },
        pause: function() {
            isPlaying = false;
            clearAllTimeouts();
            VS.control.setStateFromPointer();
            VS.layout.show();
        },
        stop: function() {
            isPlaying = false;
            clearAllTimeouts();
            VS.score.updatePointer(0);
            VS.control.set('firstStep');
            VS.layout.show();
            hooks.trigger('stop');
        },
        schedule: schedule,
        updatePointer: updatePointer
    };
})();
