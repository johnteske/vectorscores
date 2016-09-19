var scoreEvents = {
		events: [],
		playing: false,
		pointer: 0,
		preroll: 0, // 300; // delay before play
		allTimeouts: []
	},
	btn = {
		play: document.getElementById("play"),
		stop: document.getElementById("stop"),
		fwd: document.getElementById("fwd"),
		back: document.getElementById("back")
	}

function play(){
	if(!scoreEvents.playing){
		console.log('PLAY');
		scoreEvents.playing = true;
		btn.play.className = 'active';
		btn.play.textContent = '\u2016'; // pause
		btn.stop.className = '';
		btn.back.className = 'disabled';
		btn.fwd.className = 'disabled';
		schedule(scoreEvents.preroll, testEvent, scoreEvents.pointer);
	} else {
		console.log('PAUSED');
		scoreEvents.playing = false;
		btn.play.textContent = '\u25b9'; // play button
		clearSchedule();
		updateStepButtons();
	}
}
function stop(){
	console.log('STOPPED');
	scoreEvents.playing = false;
	updatePointer(0);
	btn.play.textContent = '\u25b9'; // play button
	btn.play.className = '';
	btn.stop.className = 'stopped';
	clearSchedule();
	updateStepButtons();

	// also clear active classes from elements
	var spanz = document.getElementsByTagName("span");
	for (var i = 0; i < spanz.length; i++) {
		var thisspan = spanz[i];
		thisspan.className = '';
	}
}

function clearSchedule(){
	scoreEvents.allTimeouts.forEach(function(thissched){
		clearTimeout(thissched);
	});
}

function schedule(time, fn, params) {
    console.log('sched ', params, ': ', time);
	// allTimeouts.push( setTimeout(fn, time, params) ); // not <IE9
	scoreEvents.allTimeouts.push( setTimeout(function(){ fn(params); }, time) ); // IE fix?
}
function updateStepButtons(){
	if(scoreEvents.pointer == 0) {
		btn.back.className = 'disabled';
		btn.fwd.className = '';
	} else if(scoreEvents.pointer == (scoreEvents.events.length - 1)) {
		btn.back.className = '';
		btn.fwd.className = 'disabled';
	} else {
		btn.back.className = '';
		btn.fwd.className = '';
	}
}
updateStepButtons();
function updatePointer(ndex){
	scoreEvents.pointer = ndex;
	document.getElementById("pointer").value = ndex;
}
function stepPointer(num){
	if(!scoreEvents.playing) { // don't allow skip while playing, for now
		updatePointer(Math.min(Math.max(scoreEvents.pointer + num, 0), scoreEvents.events.length - 1));
		updateStepButtons();
	}
}
function testEvent(ndex) {
	var id = scoreEvents.events[ndex];
	updatePointer(ndex);
	// this is the only event-specific code
	// all else should be part of vs library
	setSpanActive(id, ndex);
	// ^^^
	// var id = scoreEvents.events[ndex];
	if (ndex < scoreEvents.events.length - 1) {
		var diff = scoreEvents.events[ndex+1] - id;
		schedule(diff, testEvent, ndex+1);
	} else {
		stop();
	}
}

// create events
var numvents = Math.floor(Math.random()*5) + 10;
scoreEvents.events.push(0);

for (var i = 0; i < numvents; i++) {
	scoreEvents.events.push(Math.floor(Math.random()*500)+(i*1500)+1000);
}
// create event spans
for(var i = 0; i < scoreEvents.events.length; i++){
	var vent = scoreEvents.events[i],
		spanel = document.createElement("span");
	spanel.setAttribute("id", vent);
	spanel.appendChild(document.createTextNode(vent));
	document.getElementById("events").appendChild(spanel);
}
// activate span
function setSpanActive(id, ndex){
	var thing = document.getElementById(id);
	console.log('event ', ndex, ': ', id);
	thing.setAttribute("class", "active");
}
