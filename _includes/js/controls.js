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

function ControlButton(id, fn) {
    this.element = document.getElementById(id);
    this.element.onclick = fn;
}
ControlButton.prototype.enable = function() {
    this.element.className = "enabled";
};
ControlButton.prototype.disable = function() {
    this.element.className = "disabled";
};

var btn = {
    play: new ControlButton("score-play", playPause),
    stop: new ControlButton("score-stop", stop),
    fwd: new ControlButton("score-fwd", function(){ stepPointer(1); }),
    back: new ControlButton("score-back", function(){ stepPointer(-1); })
};
btn.play.setPlay = function(){ this.element.textContent = "\u25b9"; };
btn.play.setPause = function(){ this.element.textContent = "\u2016"; };

// initialize buttons
btn.play.enable();
btn.fwd.enable();

function playPause(){
    if(!scoreEvents.playing){
        play();
    } else {
        pause();
    }
}

function play() {
    scoreEvents.playing = true;
    btn.play.setPause();
    btn.stop.enable();
    btn.back.disable();
    btn.fwd.disable();
    schedule(scoreEvents.preroll, playEvent, scoreEvents.pointer);
    userPlay();
}

function pause() {
    scoreEvents.playing = false;
    btn.play.setPlay();
    scoreEvents.clearAllTimeouts();
    updateStepButtons();
}

function stop(){
    scoreEvents.playing = false;
    updatePointer(0);
    btn.play.setPlay();
    btn.play.enable();
    btn.stop.disable();
    scoreEvents.clearAllTimeouts();
    updateStepButtons();

    userStop();
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
        btn.back.disable();
        btn.fwd.enable();
    } else if(scoreEvents.pointer === (scoreEvents.getLength() - 1)) {
        btn.back.enable();
        btn.fwd.disable();
    } else {
        btn.back.enable();
        btn.fwd.enable();
    }
}

function updatePointer(ndex){
    scoreEvents.pointer = ndex;
    document.getElementById("score-pointer").value = ndex;
}
function stepPointer(num){
    if(!scoreEvents.playing) { // don't allow skip while playing, for now
        updatePointer(Math.min(Math.max(scoreEvents.pointer + num, 0), scoreEvents.getLength() - 1));
        updateStepButtons();
    }
}
