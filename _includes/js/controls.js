var scoreEvents = {
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
    }
};

function ScoreControl(id, fn) {
    this.element = document.getElementById(id);
    this.element.onclick = fn;
}

if (VS.score.footer) {
    ScoreControl.prototype.enable = function() {
        this.element.className = "enabled";
    };
    ScoreControl.prototype.disable = function() {
        this.element.className = "disabled";
    };

    var control = {
        play: new ScoreControl("score-play", playPause),
        stop: new ScoreControl("score-stop", stop),
        fwd: new ScoreControl("score-fwd", function(){ stepPointer(1); }),
        back: new ScoreControl("score-back", function(){ stepPointer(-1); }),
        pointer: new ScoreControl("score-pointer", pause),
    };
    control.play.setPlay = function(){ this.element.textContent = "\u25b9"; };
    control.play.setPause = function(){ this.element.textContent = "\u2016"; };

    // initialize buttons
    control.play.enable();
    control.fwd.enable();
}

var playCallback = VS.noop;
var stopCallback = VS.noop;

function playPause() {
    if(!scoreEvents.playing){
        play();
    } else {
        pause();
    }
}

function play() {
    scoreEvents.playing = true;
    control.play.setPause();
    control.stop.enable();
    control.back.disable();
    control.fwd.disable();
    schedule(scoreEvents.preroll, playEvent, scoreEvents.pointer);

    playCallback();
}

function pause() {
    scoreEvents.playing = false;
    control.play.setPlay();
    scoreEvents.clearAllTimeouts();
    updateStepButtons();
}

function stop() {
    scoreEvents.playing = false;
    updatePointer(0);
    control.play.setPlay();
    control.play.enable();
    control.stop.disable();
    scoreEvents.clearAllTimeouts();
    updateStepButtons();
    stopCallback();
}

function schedule(time, fn, params) {
    // allTimeouts.push( setTimeout(fn, time, params) ); // not <IE9
    scoreEvents.allTimeouts.push( setTimeout(function(){ fn(params); }, time) ); // IE fix?
}
function playEvent(ndex) {
    updatePointer(ndex);

    var thisEvent = scoreEvents.funcAt(ndex);
    thisEvent(ndex, scoreEvents.paramsAt(ndex));

    // schedule next event
    if (ndex < scoreEvents.getLength() - 1) {
        var id = scoreEvents.timeAt(ndex),
            diff = scoreEvents.timeAt(ndex+1) - id;
        schedule(diff, playEvent, ndex+1);
    } else {
        stop();
    }
}

function updateStepButtons(){
    if(scoreEvents.pointer === 0) {
        control.back.disable();
        control.fwd.enable();
    } else if(scoreEvents.pointer === (scoreEvents.getLength() - 1)) {
        control.back.enable();
        control.fwd.disable();
    } else {
        control.back.enable();
        control.fwd.enable();
    }
}

function updatePointer(ndex){
    scoreEvents.pointer = ndex;
    control.pointer.element.value = ndex;
}
function stepPointer(num){
    if(!scoreEvents.playing) { // don't allow skip while playing, for now
        updatePointer(Math.min(Math.max(scoreEvents.pointer + num, 0), scoreEvents.getLength() - 1));
        updateStepButtons();
    }
}
