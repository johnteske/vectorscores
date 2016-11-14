var scoreEvents = {
	add: function(t){ this.events.push(t) },
	events: [],
	getLength: function(){ return this.events.length },
	playing: false,
	pointer: 0,
	preroll: 0, // 300; // delay before play
	timeAt: function(i){ return this.events[i] },
	allTimeouts: [],
	clearAllTimeouts: function() {
		this.allTimeouts.forEach(function(t){
			clearTimeout(t);
		});
	}
};
var btn = {
	play: document.getElementById("play"),
	stop: document.getElementById("stop"),
	fwd: document.getElementById("fwd"),
	back: document.getElementById("back"),
	disable: function(but){ this[but].className = 'disabled'; },
	enable: function(but){ this[but].className = ''; },
	setPlay: function(){ this.play.textContent = '\u25b9'; },
	setPause: function(){ this.play.textContent = '\u2016'; }
};

function play(){
	if(!scoreEvents.playing){
		console.log('PLAY');
		scoreEvents.playing = true;
		btn.setPause();
		btn.enable('stop');
		btn.disable('back');
		btn.disable('fwd');
		schedule(scoreEvents.preroll, playEvent, scoreEvents.pointer);
	} else {
		console.log('PAUSED');
		scoreEvents.playing = false;
		btn.setPlay();
		scoreEvents.clearAllTimeouts();
		updateStepButtons();
	}
}
function stop(){
	console.log('STOPPED');
	scoreEvents.playing = false;
	updatePointer(0);
	btn.setPlay();
	btn.enable('play');
	btn.disable('stop');
	scoreEvents.clearAllTimeouts();
	updateStepButtons();

	userStop();
}

function schedule(time, fn, params) {
    console.log('sched ', params, ': ', time);
	// allTimeouts.push( setTimeout(fn, time, params) ); // not <IE9
	scoreEvents.allTimeouts.push( setTimeout(function(){ fn(params); }, time) ); // IE fix?
}
function playEvent(ndex) {
	updatePointer(ndex);

	userEvent(ndex);

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
	if(scoreEvents.pointer == 0) {
		btn.disable('back');
		btn.enable('fwd');
	} else if(scoreEvents.pointer == (scoreEvents.getLength() - 1)) {
		btn.enable('back');
		btn.disable('fwd');
	} else {
		btn.enable('back');
		btn.enable('fwd');
	}
}

function updatePointer(ndex){
	scoreEvents.pointer = ndex;
	document.getElementById("pointer").value = ndex;
}
function stepPointer(num){
	if(!scoreEvents.playing) { // don't allow skip while playing, for now
		updatePointer(Math.min(Math.max(scoreEvents.pointer + num, 0), scoreEvents.getLength() - 1));
		updateStepButtons();
	}
}
