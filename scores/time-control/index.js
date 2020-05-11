// Remove unused element
d3.select("svg").remove();

// TODO create VS.getRandInt
function getRandInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Set score size between 12 and 18 events
var nEvents = getRandInt(12, 18);

/**
 * Events and span creation
 */
function greenEvent(id, isBox) {
  var boxClass = isBox ? " box" : "";
  document.getElementById(id).setAttribute("class", "green" + boxClass);
}

function blueEvent(id) {
  document.getElementById(id).setAttribute("class", "blue");
}

// Create span with an id of its start time
function createSpan(eventTime) {
  var el = document.createElement("span");
  el.setAttribute("id", eventTime);
  el.appendChild(document.createTextNode(eventTime));

  document.getElementById("events").appendChild(el);
}

function createEvent(eventTime) {
  // Each span has a 1/2 chance of becoming green or blue
  var isUserEvent = VS.getItem([true, false]);
  // and each green span has a 1/3 chance of becoming a box
  var isBox = VS.getWeightedItem([true, false], [1, 2]);

  return {
    time: eventTime,
    action: isUserEvent ? greenEvent : blueEvent,
    parameters: [eventTime, isBox],
  };
}

/**
 * Score
 */
var score = [createEvent(0)];

for (var i = 0; i < nEvents - 1; i++) {
  var time = randomTime(i);
  score.push(createEvent(time));
}

score.forEach(function (bar) {
  VS.score.add(bar.time, bar.action, bar.parameters);
  createSpan(bar.time);
});

// Create final event so last span has time to animate
VS.score.add(randomTime(nEvents));

function randomTime(i) {
  return getRandInt(0, 500) + i * 1500 + 1000;
}

/**
 * Score and control hooks
 */

// Reset all spans to default style
function resetSpans() {
  d3.selectAll("#events span").attr("class", "");
}

// Activate all spans up to pointer
VS.control.hooks.add("step", function () {
  resetSpans();

  var index = VS.score.getPointer();

  score.slice(0, index).forEach(function (bar) {
    bar.action.apply(null, bar.parameters);
  });
});

VS.score.hooks.add("stop", resetSpans);
