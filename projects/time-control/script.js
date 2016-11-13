---
---
d3.select("svg").remove(); // svg not used in test

{% include_relative _controls.js %}

// hide elements, for now
document.getElementsByTagName("h3")[0].setAttribute("style","display: none;");
// document.getElementById("events").setAttribute("style","display: none;");

// single test event, for now
function userEvent() {
	var spanel = document.createElement("span");
	spanel.appendChild(document.createTextNode("event"));
	document.getElementById("events").appendChild(spanel);
}

// create events
var numvents = Math.floor(Math.random()*5) + 10;

function createSpan(eventTime){
	// var spanel = document.createElement("span");
	// spanel.setAttribute("id", eventTime);
	// spanel.appendChild(document.createTextNode(eventTime));
	// document.getElementById("events").appendChild(spanel);
}

// create first event
scoreEvents.add(0);
createSpan(0);

// create remaining events
for (var i = 0; i < numvents; i++) {
	var eventTime = Math.floor(Math.random()*500)+(i*1500)+1000;
	scoreEvents.add(eventTime);
	createSpan(eventTime);
}

// activate span
function setSpanActive(id, ndex){
	var thing = document.getElementById(id);
	console.log('event ', ndex, ': ', id);
	thing.setAttribute("class", "active");
}

function userStop() {
	// on stop, clear active classes from elements
	var spanz = document.getElementsByTagName("span");
	for (var i = 0; i < spanz.length; i++) {
		var thisspan = spanz[i];
		thisspan.className = '';
	}
}
