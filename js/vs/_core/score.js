VS.score = (function() {

    function schedule(time, func, params) {
        // allTimeouts.push( setTimeout(fn, time, params) ); // not <IE9
        VS.score.allTimeouts.push( setTimeout(function() { func(params); }, time) ); // IE fix?
    }

    function updatePointer(index) {
        VS.score.pointer = index;
        VS.control.pointer.element.value = index;
        VS.score.stepCallback();
    }

    function playEvent(index) {
        VS.score.updatePointer(index);

        var thisFunc = VS.score.funcAt(index);
        thisFunc.apply(null, VS.score.paramsAt(index));
        // thisFunc(index, VS.score.paramsAt(index)); // TODO don't force first argument to be index

        // schedule next event
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

        playCallback: VS.noop,
        pauseCallback: VS.noop,
        stopCallback: VS.noop,
        stepCallback: VS.noop,
        play: function() {
            VS.score.playing = true;
            VS.control.play.setPause();
            VS.control.stop.enable();
            VS.control.back.disable();
            VS.control.fwd.disable();
            schedule(VS.score.preroll, playEvent, VS.score.pointer);
            VS.layout.hide();
            VS.score.playCallback();
        },
        pause: function() {
            VS.score.playing = false;
            VS.control.play.setPlay();
            VS.score.clearAllTimeouts();
            VS.control.updateStepButtons();
            VS.layout.show();
            VS.score.pauseCallback();
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
            VS.score.stopCallback();
        },
        schedule: schedule,
        updatePointer: updatePointer

    };
})();
