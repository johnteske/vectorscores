---
layout: compress-js
---

// Remove unused element
d3.select('svg').remove();

// Set score size between 12 and 18 events
// TODO create VS.getRandInt
var nEvents = Math.floor(Math.random() * 6) + 12;


/**
 * Events and span creation
 */
function greenEvent(id, isBox) {
    var boxClass = isBox ? ' box' : '';
    document.getElementById(id).setAttribute('class', 'green' + boxClass);
}

function blueEvent(id) {
    document.getElementById(id).setAttribute('class', 'blue');
}

// Create span with an id of its start time
function createSpan(eventTime) {
    var el = document.createElement('span');
    el.setAttribute('id', eventTime);
    el.appendChild(document.createTextNode(eventTime));

    document.getElementById('events').appendChild(el);
}

// Create a span element and add an event to the score
function createEvent(eventTime) {
    // Each span has a 1/2 chance of becoming green or blue
    var isUserEvent = VS.getItem([true, false]);
    // and each green span has a 1/3 chance of becoming a box
    var isBox = VS.getWeightedItem([true, false], [1, 2]);

    if (isUserEvent) {
        VS.score.add(eventTime, greenEvent, [eventTime, isBox]);
    } else {
        VS.score.add(eventTime, blueEvent, [eventTime]);
    }

    createSpan(eventTime);
}


/**
 * Score
 */

function randomTime(i) {
    // TODO create VS.getRandInt
    return Math.floor(Math.random() * 500) + (i * 1500) + 1000;
}

// Create first event at time 0
createEvent(0);

// Create remaining events
for (var i = 0; i < (nEvents - 1); i++) {
    createEvent(randomTime(i));
}

// Create final event so last span has time to animate
VS.score.add(randomTime(nEvents));


/**
 * Score and control callbacks
 */

// Reset all spans to default style
function resetSpans() {
    d3.selectAll('#events span').attr('class', '');
}

// Activate all spans up to pointer
VS.control.hooks.add('step', function() {
    resetSpans();

    var index = VS.score.pointer;
    var params;
    var fn;

    for (var i = 0; i < index; i++) {
        params = VS.score.paramsAt(i);
        fn = VS.score.funcAt(i);
        fn.apply(null, params);
    }
});

VS.score.stopCallback = resetSpans;
