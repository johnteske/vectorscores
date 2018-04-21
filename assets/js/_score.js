VS.score = (function() {

    // Schedule this event (if defined)
    function schedule(time, func, params) {
        if (typeof func === 'function') {
            VS.score.allTimeouts.push(setTimeout(func, time, params));
        }
    }

    var hooks = VS.createHooks(['play', 'pause', 'stop', 'step']);

    function updatePointer(index) {
        VS.score.pointer = index;
        VS.control.pointer.element.value = index;
        hooks.trigger('step');
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
        events: [],
        getLength: function() { return this.events.length; },
        playing: false,
        pointer: 0,
        preroll: 0, // 300; // delay before play
        // TODO make private? and/or make single eventAt, returning object: { time: 0, fn: fn, params: []}
        timeAt: function(i) { return this.events[i][0]; },
        funcAt: function(i) { return this.events[i][1]; },
        paramsAt: function(i) { return this.events[i][2]; },
        allTimeouts: [],
        clearAllTimeouts: function() {
            this.allTimeouts.forEach(function(t) {
                clearTimeout(t);
            });
        },
        hooks: hooks,
        play: function() {
            VS.score.playing = true;
            VS.control.play.setPause();
            VS.control.stop.enable();
            VS.control.back.disable();
            VS.control.fwd.disable();
            schedule(VS.score.preroll, playEvent, VS.score.pointer);
            VS.layout.hide();
            hooks.trigger('play');
        },
        pause: function() {
            VS.score.playing = false;
            VS.control.play.setPlay();
            VS.score.clearAllTimeouts();
            VS.control.updateStepButtons();
            VS.layout.show();
            hooks.trigger('pause');
        },
        stop: function() {
            VS.score.playing = false;
            VS.score.updatePointer(0);
            VS.control.play.setPlay();
            VS.control.play.enable();
            VS.control.stop.disable();
            VS.score.clearAllTimeouts();
            VS.control.updateStepButtons();
            VS.layout.show();
            hooks.trigger('stop');
        },
        schedule: schedule,
        updatePointer: updatePointer

    };
})();
