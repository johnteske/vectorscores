var allVents = [];
var playing = false,
	playPointer = 0;
var timePointer = 0,
	preroll = 0; // 3000; // delay before play
var seqBut = document.getElementById("play"),
	stopBut = document.getElementById("stop");

function play(){
	if(!playing){
		console.log('PLAY');
		playing = true;
		seqBut.className = 'active';
		seqBut.textContent = '\u2016'; // pause
		stopBut.className = '';
		document.getElementById("back").className = 'disabled';
		document.getElementById("fwd").className = 'disabled';
		timePointer = myvents[playPointer];
		var num = myvents[playPointer];
		schedule(preroll + num - timePointer, testEvent, playPointer);
	} else {
		console.log('PAUSED');
		playing = false;
		seqBut.textContent = '\u25b9'; // play button
		allVents.forEach(function(thissched){
			clearTimeout(thissched);
		});
	}
}
function stop(){
	console.log('STOPPED');
	seqBut.textContent = '\u25b9'; // play button
	seqBut.className = '';
	stopBut.className = 'stopped';
	document.getElementById("back").className = '';
	document.getElementById("fwd").className = '';
	allVents.forEach(function(thissched){
		clearTimeout(thissched);
	});
	// also clear active classes from elements
	var spanz = document.getElementsByTagName("span");
	for (var i = 0; i < spanz.length; i++) {
		var thisspan = spanz[i];
		thisspan.className = '';
	}
	playing = false;
	updatePointer(0);
}

function schedule(time, fn, params) {
    console.log('sched ', params, ': ', time);
	// allVents.push( setTimeout(fn, time, params) ); // not <IE9
	allVents.push( setTimeout(function(){ fn(params); }, time) ); // IE fix?
}

function updatePointer(ndex){
	playPointer = ndex;
	document.getElementById("pointer").value = ndex;
}
function stepPointer(num){
	if(!playing) { // don't allow skip while playing, for now
		updatePointer(Math.min(Math.max(playPointer + num, 0), myvents.length - 1));
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
