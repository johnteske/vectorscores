var allVents = [];
var playing = false,
	playPointer = 0;
var timePointer = 0,
	preroll = 0; // 3000; // delay before play
var btn = {
	play: document.getElementById("play"),
	stop: document.getElementById("stop"),
	fwd: document.getElementById("fwd"),
	back: document.getElementById("back")
}

function play(){
	if(!playing){
		console.log('PLAY');
		playing = true;
		btn.play.className = 'active';
		btn.play.textContent = '\u2016'; // pause
		btn.stop.className = '';
		btn.back.className = 'disabled';
		btn.fwd.className = 'disabled';
		timePointer = myvents[playPointer];
		var num = myvents[playPointer];
		schedule(preroll + num - timePointer, testEvent, playPointer);
	} else {
		console.log('PAUSED');
		playing = false;
		btn.play.textContent = '\u25b9'; // play button
		clearSchedule();
		updateStepButtons(); // re-enable buttons
	}
}
function stop(){
	console.log('STOPPED');
	btn.play.textContent = '\u25b9'; // play button
	btn.play.className = '';
	btn.stop.className = 'stopped';
	btn.back.className = '';
	btn.fwd.className = '';
	clearSchedule();

	// also clear active classes from elements
	var spanz = document.getElementsByTagName("span");
	for (var i = 0; i < spanz.length; i++) {
		var thisspan = spanz[i];
		thisspan.className = '';
	}
	playing = false;
	updatePointer(0);
}

function clearSchedule(){
	allVents.forEach(function(thissched){
		clearTimeout(thissched);
	});
}

function schedule(time, fn, params) {
    console.log('sched ', params, ': ', time);
	// allVents.push( setTimeout(fn, time, params) ); // not <IE9
	allVents.push( setTimeout(function(){ fn(params); }, time) ); // IE fix?
}
function updateStepButtons(){
	if(playPointer == 0) {
		btn.back.className = 'disabled';
		btn.fwd.className = '';
	} else if(playPointer == (myvents.length - 1)) {
		btn.back.className = '';
		btn.fwd.className = 'disabled';
	} else {
		btn.back.className = '';
		btn.fwd.className = '';
	}
}
updateStepButtons();
function updatePointer(ndex){
	playPointer = ndex;
	document.getElementById("pointer").value = ndex;
}
function stepPointer(num){
	if(!playing) { // don't allow skip while playing, for now
		updatePointer(Math.min(Math.max(playPointer + num, 0), myvents.length - 1));
		updateStepButtons();
	}
}

function testEvent(ndex) {
	var id = myvents[ndex];
	updatePointer(ndex);
	setSpanActive(id, ndex);
	// sched next
	if (ndex < myvents.length - 1) {
	    var diff = myvents[ndex+1] - id;
		schedule(diff, testEvent, ndex+1);
	} else {
		stop();
	}
}

// create events
var numvents = Math.floor(Math.random()*5) + 10,
	myvents = [0];
for (var i = 0; i < numvents; i++) {
	myvents.push(Math.floor(Math.random()*500)+(i*1500)+1000);
}
// create event spans
for(var i = 0; i < myvents.length; i++){
	var vent = myvents[i],
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
