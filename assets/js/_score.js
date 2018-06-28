VS.score = (function() {

    // Schedule this event (if defined)
    function schedule(time, func, params) {
        if (typeof func === 'function') {
            VS.score.allTimeouts.push(setTimeout(func, time, params));
        }
    }

    // Add a hook for the stop event, triggered after a score ends or by the user
    var hooks = VS.createHooks(['stop']);

    function updatePointer(index) {
        VS.score.pointer = index;
        VS.control.pointer.value = index;
    }

    function playEvent(index) {
        VS.score.updatePointer(index);

        // Execute this event (if defined)
        var thisFunc = VS.score.funcAt(index);
        if (typeof thisFunc === 'function') {
            // TODO don't force first argument to be index
            thisFunc.apply(null, VS.score.paramsAt(index));
        }

        // Schedule next event
        if (index < VS.score.getLength() - 1) {
            var timeToNext = VS.score.timeAt(index + 1) - VS.score.timeAt(index);
            schedule(timeToNext, playEvent, index + 1);
        } else {
            // TODO should the score automatically stop? or should the composer call this when ready?
            VS.score.stop();
        }
    }

    return {
        add: function(time, func, params) {
            this.events.push([time, func, params]);
        },
        events: [], // TODO do not expose
        getLength: function() { return this.events.length; },
        playing: false, // TODO rename isPlaying
        pointer: 0, // TODO get only,
        pointerAtLastEvent: function() {
            return this.pointer === (this.getLength() - 1);
        },
        preroll: 0, // 300; // delay before play
        // TODO make private? and/or make single eventAt, returning object: { time: 0, fn: fn, params: []}
        timeAt: function(i) { return this.events[i][0]; },
        funcAt: function(i) { return this.events[i][1]; },
        paramsAt: function(i) { return this.events[i][2]; },
        allTimeouts: [], // TODO do not expose
        clearAllTimeouts: function() {
            this.allTimeouts.forEach(function(t) {
                clearTimeout(t);
            });
        },
        hooks: hooks,
        play: function() {
            VS.score.playing = true;
            schedule(VS.score.preroll, playEvent, VS.score.pointer);
            VS.control.set('playing');
            VS.layout.hide();
        },
        pause: function() {
            VS.score.playing = false;
            VS.score.clearAllTimeouts();
            VS.control.setStateFromPointer();
            VS.layout.show();
        },
        stop: function() {
            VS.score.playing = false;
            VS.score.clearAllTimeouts();
            VS.score.updatePointer(0);
            VS.control.set('firstStep');
            VS.layout.show();
            hooks.trigger('stop');
        },
        schedule: schedule,
        updatePointer: updatePointer
    };
})();
