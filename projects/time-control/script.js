---
---
d3.select("svg").remove(); // svg not used in test

{% include_relative _controls.js %}

function testEvent(ndex) {
	var id = scoreEvents.timeAt(ndex);
	updatePointer(ndex);
	// this is the only event-specific code
	// all else should be part of vs library
	setSpanActive(id, ndex);
	// ^^^
	// var id = scoreEvents.events[ndex];
	if (ndex < scoreEvents.getLength() - 1) {
		var diff = scoreEvents.timeAt(ndex+1) - id;
		schedule(diff, testEvent, ndex+1);
	} else {
		stop();
	}
}

//
// TEST events
//

// create events
var numvents = Math.floor(Math.random()*5) + 10;

function createSpan(eventTime){
	var spanel = document.createElement("span");
	spanel.setAttribute("id", eventTime);
	spanel.appendChild(document.createTextNode(eventTime));
	document.getElementById("events").appendChild(spanel);
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
