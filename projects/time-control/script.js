d3.select("svg").remove(); // svg not used in test

// an example of using schedule() independent of playEvents()
// could also create (click/interaction) event apart from scoreEvents
// or forgo using a score structure altogether
// schedule(1000, play, "no params");
// setTimeout(function(){
	// document.getElementsByTagName("header")[0].setAttribute("class", "hide");
// }, 3000);

function userEvent(ndex, params) {
	var id = params[0],
		boxClass = params[1] ? " box" : "";
	document.getElementById(id).setAttribute("class", "event-span active" + boxClass);
}
function objEvent(ndex, params) {
	var id = params.time,
		boxClass = params.box ? " box" : "";
	document.getElementById(id).setAttribute("class", "event-span other");
}

// create events
var numvents = Math.floor(Math.random()*5) + 10;

function createSpan(eventTime){
	var spanel = document.createElement("span");
	spanel.setAttribute("id", eventTime);
	spanel.className = "event-span";
	spanel.appendChild(document.createTextNode(eventTime));
	document.getElementById("events").appendChild(spanel);
}

function createEvent(eventTime, eventFunc, eventParams) {
	var coinFlip = getItem([0, 1]),
		isBox = getItem([0, 1, 1]);
	if(coinFlip){
		scoreEvents.add([eventTime, userEvent, [eventTime, isBox]]); // scoreEvent -- [time, function, params]
	} else {
		scoreEvents.add([eventTime, objEvent, {time: eventTime, box: isBox}]); // scoreEvent -- [time, function, params]
	}
	createSpan(eventTime);
}
createEvent(0); // create first event
for (var i = 0; i < numvents; i++) { // create remaining events
	var eventTime = Math.floor(Math.random()*500)+(i*1500)+1000;
	createEvent(eventTime);
}

function userPlay() {
	document.getElementById("score-header").className = "hide";
	document.getElementById("score-footer").className = "hide";
}

function userStop() {
	var spanz = document.getElementsByClassName("event-span");
	for (var i = 0; i < spanz.length; i++) {
		var thisspan = spanz[i];
		thisspan.className = 'event-span';
	}
	document.getElementById("score-header").className = "";
	document.getElementById("score-footer").className = "";
}
