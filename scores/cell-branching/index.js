/**
 * NOTE using intervalSpread, the timing of events in each part will be unique.
 * Use of the score step buttons and playing from any point other than the start
 * will not be timed properly--although the step function should be disabled on
 * this work anyway (even if the script made choices, it would be random,
 * not the same as real musicians making choices).
 */
var score = {
  width: 320,
  height: 320,
  cell: {
    size: 90,
    buffer: 30,
  },
  nEvents: 8,
  interval: 30000,
  intervalSpread: 5000,
  // TODO increase over time/score pointer?
  // TODO scale according to number of choices per param?
  weightScale: 5,
  transitionTime: 300,
};

var debug = +VS.getQueryString("debug") === 1;

var layout = {
  margin: {},
};

score.center = {
  x: score.width * 0.5,
  y: score.height * 0.5,
};

score.cell.halfSize = score.cell.size * 0.5;

score.partWeight = score.weightScale; // init

score.choices = {};
score.selected = false;

// {% include_relative _options.js %}
VS.scoreOptions.add(
  "pitchClasses",
  { "pitch-classes": "numbers", prefer: "te" },
  new VS.PitchClassSettings()
);

var scoreOptions = VS.scoreOptions.setFromQueryString();

// TODO working with old property names in score, for now
scoreOptions.pitchClasses.display = scoreOptions.pitchClasses["pitch-classes"];
scoreOptions.pitchClasses.preference = scoreOptions.pitchClasses["prefer"];

/**
 * Symbols and choice
 */

// {% include_relative _params.js %}
var params = (function () {
  var params = {
    keys: [],
    data: [],
  };

  params.add = function (key, keys) {
    var property = {
      keys: [],
      weights: [],
    };

    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];

      property.keys.push(k.toString());
      property.weights.push(1);
    }

    params.keys.push(key);
    params.data[key] = property;

    return property;
  };

  params.createChoice = function (filterRest) {
    var choice = {};

    for (var i = 0; i < params.keys.length; i++) {
      var key = params.keys[i];
      var keys = params.data[key].keys;
      var weights = params.data[key].weights;

      if (key === "phrase" && filterRest) {
        keys = keys.slice(1);
        weights = weights.slice(1);
      }

      choice[key] = VS.getWeightedItem(keys, weights);
    }

    return choice;
  };

  params.updateWeights = function (choice, increment) {
    for (var i = 0; i < params.keys.length; i++) {
      var key = params.keys[i];
      var data = params.data[key];
      if (choice[key]) {
        data.weights[data.keys.indexOf(choice[key])] += increment;
      }
    }
  };

  params.getWeights = function () {
    var weights = "";

    for (var i = 0; i < params.keys.length; i++) {
      var key = params.keys[i];
      var data = params.data[key];

      weights += key + ": " + data.weights + "\n";
    }

    return weights;
  };

  return params;
})();

var durations = VS.dictionary.Bravura.durations.stemless;
var dynamics = VS.dictionary.Bravura.dynamics;
var phrases = [0, 1, 2, 3, 4];

params.add("duration", Object.keys(durations));
params.add(
  "dynamic",
  Object.keys(dynamics).filter(function (k) {
    return k !== "n";
  })
);
params.add("pitchClasses", VS.trichords);
params.add("phrase", phrases);
// params.add('intervalClasses', [1, 2, 3, 4, 5, 6]);

function transformCell(selection, position, selected) {
  var opacity = typeof selected !== "undefined" && !selected ? 0 : 1;

  var translateFn;
  if (selected) {
    translateFn = translateSelectedCell;
  } else {
    translateFn = position === "top" ? translateTopCell : translateBottomCell;
  }

  selection
    .transition()
    .duration(score.transitionTime)
    .style("opacity", opacity)
    .attr("transform", translateFn);
  // .transition()
  // .style('cursor', selected ? 'default' : 'pointer');
}

function formatPCSet(setString) {
  var PC = VS.pitchClass,
    formatted = "";

  if (setString) {
    var set = PC.transpose(setString.split(","), "random").sort(function (
      a,
      b
    ) {
      return a - b;
    });
    formatted = "{" + PC.format(set) + "}";
  }

  return formatted;
}

function updateChoices() {
  var choices = score.choices;

  choices.top = params.createChoice();
  choices.bottom = params.createChoice(+choices.top.phrase === 0);

  function updateCell(selection, choice) {
    var isRest = +choice.phrase === 0,
      phrase = [];

    if (isRest) {
      choice.pitchClasses = "";
      choice.duration = "";
      phrase.push("\ue4e5");
      choice.dynamic = "";
    } else {
      for (var i = 0; i < +choice.phrase; i++) {
        phrase.push(durations[choice.duration]);
      }
    }

    var set = choice.pitchClasses.split(",");

    var formatted = VS.pitchClass.transpose(set, "random").map(function (pc) {
      return VS.pitchClass.format(
        pc,
        scoreOptions.pitchClasses.display,
        scoreOptions.pitchClasses.preference
      );
    });

    selection.select(".pitch-classes").text("{" + formatted + "}");
    // selection.select('circle')
    // .style('opacity', isRest ? 0 : 1);
    // selection.select('.duration')
    //     .text(durations[choice.duration]);
    selection.select(".phrase").text(phrase.join(" "));
    selection.select(".dynamic").text(dynamics[choice.dynamic]);
  }

  score.topGroup.call(transformCell, "top");
  score.topGroup.call(updateCell, choices.top);

  score.bottomGroup.call(transformCell, "bottom");
  score.bottomGroup.call(updateCell, choices.bottom);

  score.selected = false;
}

function selectCell(position) {
  if (!score.selected && VS.score.isPlaying()) {
    score.selected = true; // disable selection until new choices

    // update symbol weights
    var choice = score.choices[position];
    params.updateWeights(choice, score.partWeight);

    score.topGroup.call(transformCell, "bottom", position === "top");
    score.bottomGroup.call(transformCell, "bottom", position === "bottom");

    VS.WebSocket.send(["choice", choice]);

    debugChoices();
  }
}

function debugChoices() {
  if (!debug) {
    return;
  }

  var el = document.getElementsByClassName("debug")[0];

  el.innerHTML = "weight: " + score.partWeight + "<br />";
  el.innerHTML += params.getWeights().split("\n").join("<br />");
}

/**
 * Create cells
 */
function translateTopCell() {
  return (
    "translate(" +
    (score.center.x - score.cell.halfSize) +
    ", " +
    (score.center.y - score.cell.size - score.cell.buffer) +
    ")"
  );
}

function translateBottomCell() {
  return (
    "translate(" +
    (score.center.x - score.cell.halfSize) +
    ", " +
    (score.center.y + score.cell.buffer) +
    ")"
  );
}

function translateSelectedCell() {
  return (
    "translate(" +
    (score.center.x - score.cell.halfSize) +
    ", " +
    (score.center.y - score.cell.halfSize) +
    ")"
  );
}

score.svg = d3.select(".main");

score.wrapper = score.svg.append("g");

function createCell(selection) {
  selection.attr("transform", translateSelectedCell).style("opacity", 0);

  selection
    .append("rect")
    .attr("class", "phrase-container")
    .attr("width", score.cell.size)
    .attr("height", score.cell.size);

  selection
    .append("text")
    .attr("class", "pitch-classes monospace")
    .attr("dy", "-1em");

  var r = (22 * 1.5) / 2;
  // selection.append('circle')
  //     .attr('cx', score.cell.size - r)
  //     .attr('cy', -1.5 * r)
  //     .attr('r', r)
  //     .attr('stroke', 'black')
  //     .attr('fill', 'none');
  // selection.append('text')
  //     .attr('class', 'duration bravura')
  //     .attr('text-anchor', 'middle')
  //     .attr('x', score.cell.size - r)
  //     .attr('y', -0.5 * r)
  //     .attr('dy', '-1em');

  selection
    .append("text")
    .attr("class", "phrase bravura")
    .attr("x", score.cell.halfSize)
    .attr("y", score.cell.halfSize);

  selection
    .append("text")
    .attr("class", "dynamic bravura")
    .attr("x", score.cell.halfSize)
    .attr("y", score.cell.size - 5)
    .attr("dy", -5);
}

score.topGroup = score.wrapper
  .append("g")
  .call(createCell)
  .on("click", function () {
    selectCell("top");
  });

score.bottomGroup = score.wrapper
  .append("g")
  .call(createCell)
  .on("click", function () {
    selectCell("bottom");
  });

function clearGroup(position) {
  var group = position + "Group";

  score[group].call(transformCell, position);
  score[group].selectAll(".bravura").text("");
  score[group].select(".pitch-classes").text("{}");
}

function clearChoices() {
  // TODO also clear choice weights

  clearGroup("top");
  clearGroup("bottom");
}

clearChoices();

/**
 * Resize
 */
function resize() {
  var main = d3.select("main");

  var w = parseInt(main.style("width"), 10);
  var h = parseInt(main.style("height"), 10);

  var scaleX = VS.clamp(w / score.width, 0.25, 2);
  var scaleY = VS.clamp(h / score.height, 0.25, 2);

  layout.scale = Math.min(scaleX, scaleY);

  layout.margin.left = w * 0.5 - score.width * 0.5 * layout.scale;
  layout.margin.top = h * 0.5 - score.height * 0.5 * layout.scale;

  score.wrapper.attr(
    "transform",
    "translate(" +
      layout.margin.left +
      "," +
      layout.margin.top +
      ") scale(" +
      layout.scale +
      "," +
      layout.scale +
      ")"
  );
}

d3.select(window).on("resize", resize);

d3.select(window).on("load", resize);

/**
 * Populate score
 */
for (var i = 0; i < score.nEvents + 1; i++) {
  VS.score.add(
    i *
      (score.interval +
        VS.getRandExcl(score.intervalSpread, -score.intervalSpread)),
    updateChoices,
    []
  );
}

// {% include_relative _controls.js %}
/**
 * Hooks
 * Choices should be cleared so new choices can be loaded and selected on play
 */
VS.control.hooks.add("pause", clearChoices);
VS.WebSocket.hooks.add("pause", clearChoices);
VS.score.hooks.add("stop", clearChoices);

/**
 * Keyboard
 */
function keydownListener(event) {
  if (event.defaultPrevented) {
    return;
  }

  switch (event.keyCode) {
    case 38:
      selectCell("top");
      break;
    case 40:
      selectCell("bottom");
      break;
    default:
      return;
  }
  event.preventDefault();
}
window.addEventListener("keydown", keydownListener, true);

/**
 * Websocket
 */
VS.WebSocket.hooks.add("message", function (data) {
  var cid = data[0];
  var type = data[1];
  var msg = data[2];

  if (type === "ws" && msg === "connections") {
    score.partWeight = (1 / data[3]) * score.weightScale;
    debugChoices();
  } else if (type === "choice" && cid !== VS.WebSocket.cid) {
    params.updateWeights(msg, score.partWeight);
    debugChoices();
  }
});

VS.WebSocket.connect();
