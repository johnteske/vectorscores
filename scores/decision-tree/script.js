---
layout: compress-js
---
var score = {
    width: 320,
    height: 320,
    cell: {
        size: 60
    },
    choices: {}
};

score.center = {
    x: score.width * 0.5,
    y: score.height * 0.5
};

score.cell.halfSize = score.cell.size * 0.5;

/**
 * Symbols and choice
 */

{% include_relative _properties.js %}

var durations = makePropertyObj(VS.dictionary.Bravura.durations.stemless);
var dynamics = makePropertyObj(VS.dictionary.Bravura.dynamics);

function createChoices() {
    score.choices.top = {
        duration: VS.getWeightedItem(durations.keys, durations.weights),
        dynamic: VS.getWeightedItem(dynamics.keys, dynamics.weights)
    };
    score.choices.bottom = {
        duration: VS.getWeightedItem(durations.keys, durations.weights),
        dynamic: VS.getWeightedItem(dynamics.keys, dynamics.weights)
    };
}

function makeChoice(position) {
    // update symbol weights
    if (position) {
        var choice = score.choices[position];
        durations.weights[durations.keys.indexOf(choice.duration)] += 1;
        dynamics.weights[dynamics.keys.indexOf(choice.dynamic)] += 1;
    }

    // debug
    console.log(durations.weights);
    console.log(dynamics.weights);

    createChoices();

    score.topGroup.select(".duration")
        .text(durations.symbols[score.choices.top.duration]);
    score.topGroup.select(".dynamic")
        .text(dynamics.symbols[score.choices.top.dynamic]);
    score.bottomGroup.select(".duration")
        .text(durations.symbols[score.choices.bottom.duration]);
    score.bottomGroup.select(".dynamic")
        .text(dynamics.symbols[score.choices.bottom.dynamic]);
}


/**
 * Create cells
 */

score.svg = d3.select(".main")
    .attr("width", score.width)
    .attr("height", score.height);

score.topGroup = score.svg.append("g")
    .attr("transform", "translate(" +
        (score.center.x - score.cell.halfSize) + ", " +
        (score.center.y - score.cell.size - score.cell.halfSize) + ")")
    .on("click", function() {
        makeChoice("top");
    });
score.bottomGroup = score.svg.append("g")
    .attr("transform", "translate(" +
        (score.center.x - score.cell.halfSize) + ", " +
        (score.center.y + score.cell.halfSize) + ")")
    .on("click", function() {
        makeChoice("bottom");
    });

score.topGroup.append("rect")
    .attr("width", score.cell.size)
    .attr("height", score.cell.size);
score.bottomGroup.append("rect")
    .attr("width", score.cell.size)
    .attr("height", score.cell.size);

score.topGroup.append("text")
    .attr("class", "duration")
    .attr("x", score.cell.halfSize)
    .attr("y", score.cell.halfSize);
score.topGroup.append("text")
    .attr("class", "dynamic")
    .attr("x", score.cell.halfSize)
    .attr("y", score.cell.size - 5);
score.bottomGroup.append("text")
    .attr("class", "duration")
    .attr("x", score.cell.halfSize)
    .attr("y", score.cell.halfSize);
score.bottomGroup.append("text")
    .attr("class", "dynamic")
    .attr("x", score.cell.halfSize)
    .attr("y", score.cell.size - 5);

makeChoice(); // initial choices


/**
 * Keyboard control
 */

function keydownListener(event) {
    if (event.defaultPrevented) { return; }

    switch (event.keyCode) {
    case 38:
        makeChoice("top");
        break;
    case 40:
        makeChoice("bottom");
        break;
    default:
        return;
    }
    event.preventDefault();
}
window.addEventListener("keydown", keydownListener, true);
