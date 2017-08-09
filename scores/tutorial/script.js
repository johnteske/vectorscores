---
#layout: compress-js
---

d3.select("svg").remove();

var message = document.getElementsByClassName("tutorial-message")[0];
var initialMessage = message.innerHTML;
var header = VS.page.header;
var footer = VS.page.footer;
var infoButton = document.querySelector("#score-info-open");
var footerButtons = footer.querySelectorAll("button");
var footerInput = footer.querySelector("input");

function clearHighlights() {
    header.className = "show";
    footer.className = "show";
    infoButton.className = "";
    footerInput.className = "";
    for (var i = 0; i < footerButtons.length; i++) {
        footerButtons[i].className = "";
    }
}

function highlightByID(id) {
    var el = document.getElementById(id);
    el.className = "highlight";
}

/**
 * Create events
 */
var addEvent = (function() {
    var time = 0;

    return function(fn, duration) {
        VS.score.add(time, fn);
        time += duration;
    };
})();

addEvent(function() {
    clearHighlights();
    message.innerHTML = initialMessage;
}, 5000);

addEvent(function() {
    clearHighlights();
    message.innerHTML = "The header and footer of each score will disappear when playing and will reappear when paused or stopped.";
    // VS.score.schedule(1, VS.score.pause);
}, 5000);

addEvent(function() {
    clearHighlights();
    highlightByID("score-back");
    message.innerHTML = "Step score back";
}, 1000);

addEvent(function() {
    clearHighlights();
    highlightByID("score-play");
    message.innerHTML = "Play/pause score";
}, 1000);

addEvent(function() {
    clearHighlights();
    highlightByID("score-stop");
    message.innerHTML = "Stop score";
}, 1000);

addEvent(function() {
    clearHighlights();
    highlightByID("score-fwd");
    message.innerHTML = "Step score forward";
}, 1000);

addEvent(function() {
    clearHighlights();
    highlightByID("score-pointer");
    message.innerHTML = "Current score position";
}, 1000);

addEvent(function() {
    clearHighlights();
    highlightByID("score-settings-open");
    message.innerHTML = "Score settings";
}, 1000);

addEvent(function() {
    clearHighlights();
    highlightByID("score-info-open");
    message.innerHTML = "Score information";
}, 1000);

addEvent(function() {
    clearHighlights();
    message.innerHTML = "";
}, 1000);

/**
 *
 */
VS.score.stepCallback = function() {
    VS.score.funcAt(VS.score.pointer)();
};

VS.score.stopCallback = function() {
    message.innerHTML = initialMessage;
};
