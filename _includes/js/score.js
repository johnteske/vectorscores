VS.score = (function () {

    function schedule(time, fn, params) {
        // allTimeouts.push( setTimeout(fn, time, params) ); // not <IE9
        VS.score.allTimeouts.push( setTimeout(function(){ fn(params); }, time) ); // IE fix?
    }

    function playEvent(ndex) {
        updatePointer(ndex); // should be part of VS, not global

        var thisEvent = VS.score.funcAt(ndex);
        thisEvent(ndex, VS.score.paramsAt(ndex));

        // schedule next event
        if (ndex < VS.score.getLength() - 1) {
            var id = VS.score.timeAt(ndex),
                diff = VS.score.timeAt(ndex + 1) - id;
            schedule(diff, playEvent, ndex + 1);
        } else {
            VS.score.stop();
        }
    }

    return {
        add: function(t){ this.events.push(t); }, // TODO this should accept arguments (not an array) and push an array of those arguments to events
        events: [],
        getLength: function(){ return this.events.length; },
        playing: false,
        pointer: 0,
        preroll: 0, // 300; // delay before play
        timeAt: function(i){ return this.events[i][0]; },
        funcAt: function(i){ return this.events[i][1]; },
        paramsAt: function(i){ return this.events[i][2]; },
        allTimeouts: [],
        clearAllTimeouts: function() {
            this.allTimeouts.forEach(function(t){
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
            VS.page.hideLayout();
            VS.score.playCallback();
        },
        pause: function() {
            VS.score.playing = false;
            VS.control.play.setPlay();
            VS.score.clearAllTimeouts();
            VS.control.updateStepButtons();
            VS.page.showLayout();
            VS.score.pauseCallback();
        },
        playPause: function() {
            if(!VS.score.playing){
                VS.score.play();
            } else {
                VS.score.pause();
            }
        },
        stop: function() {
            VS.score.playing = false;
            updatePointer(0);
            VS.control.play.setPlay();
            VS.control.play.enable();
            VS.control.stop.disable();
            VS.score.clearAllTimeouts();
            VS.control.updateStepButtons();
            VS.page.showLayout();
            VS.score.stopCallback();
        },
        schedule: schedule

    };
})();
