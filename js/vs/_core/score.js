VS.score = (function () {

    function schedule(time, func, params) {
        // allTimeouts.push( setTimeout(fn, time, params) ); // not <IE9
        VS.score.allTimeouts.push( setTimeout(function(){ func(params); }, time) ); // IE fix?
    }

    function playEvent(index) {
        updatePointer(index); // should be part of VS, not global

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
        add: function(time, func, params){
            this.events.push([time, func, params]);
        },
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
