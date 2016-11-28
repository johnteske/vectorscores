VS.score = (function () {

    function schedule(time, fn, params) {
        // allTimeouts.push( setTimeout(fn, time, params) ); // not <IE9
        VS.score.allTimeouts.push( setTimeout(function(){ fn(params); }, time) ); // IE fix?
    }

    function playEvent(ndex) {
        updatePointer(ndex);

        var thisEvent = VS.score.funcAt(ndex);
        thisEvent(ndex, VS.score.paramsAt(ndex));

        // schedule next event
        if (ndex < VS.score.getLength() - 1) {
            var id = VS.score.timeAt(ndex),
                diff = VS.score.timeAt(ndex+1) - id;
            schedule(diff, playEvent, ndex+1);
        } else {
            VS.score.stop();
        }
    }

    return {
        add: function(t){ this.events.push(t); },
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
        stopCallback: VS.noop,
        play: function() {
            VS.score.playing = true;
            VS.control.play.setPause();
            VS.control.stop.enable();
            VS.control.back.disable();
            VS.control.fwd.disable();
            schedule(VS.score.preroll, playEvent, VS.score.pointer);
            VS.score.playCallback();
        },
        pause: function() {
            VS.score.playing = false;
            VS.control.play.setPlay();
            VS.score.clearAllTimeouts();
            VS.control.updateStepButtons();
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
            VS.score.stopCallback();
        },
        schedule: schedule

    };
})();

if (VS.page.footer) {

    VS.control = (function () {

        function ScoreControl(id, fn) {
            this.element = document.getElementById(id);
            this.element.onclick = fn;
        }
        ScoreControl.prototype.enable = function() {
            this.element.className = "enabled";
        };
        ScoreControl.prototype.disable = function() {
            this.element.className = "disabled";
        };

        var play = new ScoreControl("score-play", VS.score.playPause);
        play.setPlay = function(){ this.element.textContent = "\u25b9"; };
        play.setPause = function(){ this.element.textContent = "\u2016"; };

        return {
            play: play,
            stop: new ScoreControl("score-stop", VS.score.stop),
            fwd: new ScoreControl("score-fwd", function(){ stepPointer(1); }),
            back: new ScoreControl("score-back", function(){ stepPointer(-1); }),
            pointer: new ScoreControl("score-pointer", VS.score.pause),
            updateStepButtons: function() {
                if(VS.score.pointer === 0) {
                    this.back.disable();
                    this.fwd.enable();
                } else if(VS.score.pointer === (VS.score.getLength() - 1)) {
                    this.back.enable();
                    this.fwd.disable();
                } else {
                    this.back.enable();
                    this.fwd.enable();
                }
            }
        };

    })();

    VS.control.play.enable();
    VS.control.fwd.enable();
}

function updatePointer(ndex){ // score, control
    VS.score.pointer = ndex;
    VS.control.pointer.element.value = ndex;
}

function stepPointer(num){ // score, control
    if(!VS.score.playing) { // don't allow skip while playing, for now
        updatePointer(Math.min(Math.max(VS.score.pointer + num, 0), VS.score.getLength() - 1));
        VS.control.updateStepButtons();
    }
}
