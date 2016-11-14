---
---
d3.select("svg").remove(); // svg not used in test

{% include_relative _controls.js %}

// an example of using schedule() independent of playEvents()
// could also create (click/interaction) event apart from scoreEvents
// or forgo using a score structure altogether
schedule(1000, play, "no params");

function userEvent(ndex) {
	var id = scoreEvents.events[ndex];
	setSpanActive(id);
}

// create events
var numvents = Math.floor(Math.random()*5) + 10;

function createSpan(eventTime){
	var spanel = document.createElement("span");
	spanel.setAttribute("id", eventTime);
	spanel.appendChild(document.createTextNode(eventTime));
	document.getElementById("events").appendChild(spanel);
}

function createEvent(eventTime, eventFunc, eventParams) {
	scoreEvents.add(eventTime); // scoreEvent -- [time, function, params]
	createSpan(eventTime);
}
createEvent(0); // create first event
for (var i = 0; i < numvents; i++) { // create remaining events
	var eventTime = Math.floor(Math.random()*500)+(i*1500)+1000;
	createEvent(eventTime);
}

// activate span
function setSpanActive(id){
	var thing = document.getElementById(id);
	thing.setAttribute("class", "active");
}

function userStop() {
	function clearSpans(){
		// on stop, clear active classes from elements
		var spanz = document.getElementsByTagName("span");
		for (var i = 0; i < spanz.length; i++) {
			var thisspan = spanz[i];
			thisspan.className = '';
		}
	}
	schedule(3000, clearSpans, "no params");
}
