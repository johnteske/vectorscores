---
layout: compress-js
---

d3.select('svg').remove(); // svg not used in test

function userEvent(ndex, id, box) {
    var boxClass = box ? ' box' : '';
    document.getElementById(id).setAttribute('class', 'event-span active' + boxClass);
}
function objEvent(ndex, id) {
    document.getElementById(id).setAttribute('class', 'event-span other');
}

// create events
var numvents = Math.floor(Math.random() * 5) + 10;

function createSpan(eventTime) {
    var spanel = document.createElement('span');
    spanel.setAttribute('id', eventTime);
    spanel.className = 'event-span';
    spanel.appendChild(document.createTextNode(eventTime));
    document.getElementById('events').appendChild(spanel);
}

function createEvent(eventTime) {
    var coinFlip = VS.getItem([0, 1]),
        isBox = VS.getItem([0, 1, 1]);
    if (coinFlip) {
        VS.score.add(eventTime, userEvent, [null, eventTime, isBox]); // scoreEvent -- [time, function, params]
    } else {
        VS.score.add(eventTime, objEvent, [null, eventTime]); // scoreEvent -- [time, function, params]
    }
    createSpan(eventTime);
}

createEvent(0); // create first event

for (var i = 0; i < numvents; i++) { // create remaining events
    var eventTime = Math.floor(Math.random() * 500) + (i * 1500) + 1000;
    createEvent(eventTime);
}

VS.score.stopCallback = function() {
    d3.selectAll('.event-span').attr('class', 'event-span'); // force this class only
};
