//---
//#layout: compress-js
//---

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
var score = [];

score.push(function() {
    message.innerHTML = initialMessage;
    // VS.score.schedule(1500, VS.score.pause);
});

score.push(function() {
    message.innerHTML = "The header and footer of each score will disappear when playing and will reappear when paused or stopped.";
});

score.push(function() {
    clearHighlights();
    footer.className = "show highlight";
    message.innerHTML = "This is the footer.";
});

score.push(function() {
    clearHighlights();
    highlightByID("score-back");
    message.innerHTML = "score-back";
});

score.push(function() {
    clearHighlights();
    highlightByID("score-play");
    message.innerHTML = "score-play";
});

score.push(function() {
    clearHighlights();
    highlightByID("score-stop");
    message.innerHTML = "score-stop";
});

score.push(function() {
    clearHighlights();
    highlightByID("score-fwd");
    message.innerHTML = "score-fwd";
});

score.push(function() {
    clearHighlights();
    highlightByID("score-pointer");
    message.innerHTML = "score-pointer";
});

score.push(function() {
    clearHighlights();
    highlightByID("score-settings-open");
    message.innerHTML = "score-settings-open";
});

score.push(function() {
    clearHighlights();
    highlightByID("score-info-open");
    message.innerHTML = "score-info-open";
});

score.push(function() {
    clearHighlights();
    message.innerHTML = "";
});

/**
 * Populate score
 */
for (var i = 0; i < score.length; i++) {
    VS.score.add(i * 5000, score[i]);
}

VS.score.stepCallback = function() {
    score[VS.score.pointer]();
};

VS.score.stopCallback = function() {
    message.innerHTML = initialMessage;
};
