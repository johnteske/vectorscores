---
layout: compress-js
---

d3.select('svg').remove();

var message = document.getElementsByClassName('tutorial-message')[0];
var initialMessage = message.innerHTML;

var scoreButtons = document.querySelectorAll('.score-button');
var footerInput = document.querySelector('#score-footer input');

function clearHighlights() {
    VS.layout.show();
    footerInput.className = '';

    scoreButtons.forEach(function(button) {
        button.classList.remove('highlight');
    });
}

function highlightByID(id) {
    document.getElementById(id).classList.add('highlight');
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
}, 3000);

addEvent(function() {
    clearHighlights();
    message.innerHTML = 'The header and footer of a score will disappear when playing and will reappear when paused or stopped.';
    // VS.score.schedule(1, VS.score.pause);
}, 5000);

addEvent(function() {
    clearHighlights();
    highlightByID('score-play');
    message.innerHTML = 'To start or pause score play, click the play/pause button or press the spacebar.';
}, 3000);

addEvent(function() {
    clearHighlights();
    highlightByID('score-stop');
    message.innerHTML = 'To stop score play, click the stop button or press the escape key.';
}, 3000);

addEvent(function() {
    clearHighlights();
    highlightByID('score-pointer');
    message.innerHTML = 'The current score position is displayed here.';
}, 3000);

addEvent(function() {
    clearHighlights();
    highlightByID('score-back');
    highlightByID('score-fwd');
    message.innerHTML = 'When a score is not playing, you can set the score position with the forward and back buttons or by using the left and right arrow keys.';
}, 3000);

addEvent(function() {
    clearHighlights();
    highlightByID('score-info-open');
    message.innerHTML = 'If a score has additional information such as performance notes, they can be displayed by clicking the info button.';
}, 3000);

addEvent(function() {
    clearHighlights();
    highlightByID('score-options-open');
    message.innerHTML = 'If a score has options that can be set by performers, they can accessed by clicking the options button.';
}, 3000);

addEvent(function() {
    clearHighlights();
    message.innerHTML = '';
}, 3000);

/**
 *
 */
VS.control.hooks.add('step', function() {
    VS.score.functionAt(VS.score.getPointer())();
});

VS.score.hooks.add('stop', function() {
   message.innerHTML = initialMessage;
   clearHighlights();
});
