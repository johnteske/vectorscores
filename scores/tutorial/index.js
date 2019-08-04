(function () {
  'use strict';

  d3.select("svg").remove();

  var messageElement = document.getElementsByClassName("tutorial-message")[0];
  var initialMessage = messageElement.innerHTML;

  var scoreButtons = document.querySelectorAll(".score-button");
  var footerInput = document.querySelector("#score-footer input");

  function clearHighlights() {
    VS.layout.show();
    footerInput.className = "";

    scoreButtons.forEach(function(button) {
      button.classList.remove("highlight");
    });
  }

  function highlightByID(id) {
    document.getElementById(id).classList.add("highlight");
  }

  function describeControl(ids, message) {
    clearHighlights();
    ids.forEach(highlightByID);
    messageElement.innerHTML = message;
  }

  /**
   * Create events
   */
  var score = [
    {
      ids: [],
      message: initialMessage,
      duration: 3
    },
    {
      ids: [],
      message:
        "The header and footer of a score will disappear when playing and will reappear when paused or stopped.",
      duration: 5
    },
    {
      ids: ["score-play"],
      message:
        "To start or pause score play, click the play/pause button or press the spacebar.",
      duration: 3
    },
    {
      ids: ["score-stop"],
      message:
        "To stop score play, click the stop button or press the escape key.",
      duration: 3
    },
    {
      ids: ["score-pointer"],
      message: "The current score position is displayed here.",
      duration: 3
    },
    {
      ids: ["score-back", "score-fwd"],
      message:
        "When a score is not playing, you can set the score position with the forward and back buttons or by using the left and right arrow keys.",
      duration: 3
    },
    {
      ids: ["score-info-open"],
      message:
        "If a score has additional information such as performance notes, they can be displayed by clicking the info button.",
      duration: 3
    },
    {
      ids: ["score-options-open"],
      message:
        "If a score has options that can be set by performers, they can accessed by clicking the options button.",
      duration: 3
    },
    {
      ids: [],
      message: "",
      duration: 1
    }
  ].map(addTime);

  function addTime(bar, i, score) {
    bar.time =
      score.slice(0, i).reduce(function(sum, bar2) {
        return (sum += bar2.duration);
      }, 0) * 1000;

    return bar;
  }

  score.forEach(function(bar) {
    VS.score.add(bar.time, describeControl, [bar.ids, bar.message]);
  });

  /**
   * Controls
   */
  VS.control.hooks.add("step", function() {
    var bar = score[VS.score.getPointer()];
    describeControl(bar.ids, bar.message);
  });

  VS.score.hooks.add("stop", function() {
    messageElement.innerHTML = initialMessage;
    clearHighlights();
  });

}());
