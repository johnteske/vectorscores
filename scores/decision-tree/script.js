---
layout: compress-js
---
var score = {
    width: 320,
    height: 320,
    cell: {
        size: 60
    },
    choices: {},
    selected: false
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

    score.topGroup
        .transition()
        .duration(300)
        .style("opacity", 1)
        .attr("transform", translateTopCell);
    score.topGroup.select(".duration")
        .text(durations.symbols[score.choices.top.duration]);
    score.topGroup.select(".dynamic")
        .text(dynamics.symbols[score.choices.top.dynamic]);

    score.bottomGroup
        .transition()
        .duration(300)
        .style("opacity", 1)
        .attr("transform", translateBottomCell);
    score.bottomGroup.select(".duration")
        .text(durations.symbols[score.choices.bottom.duration]);
    score.bottomGroup.select(".dynamic")
        .text(dynamics.symbols[score.choices.bottom.dynamic]);

    score.selected = false;
}

function makeChoice(position) {
    if (!score.selected) {

        score.selected = true; // disable selection until new choices

        // update symbol weights
        if (position) {
            var choice = score.choices[position];
            durations.weights[durations.keys.indexOf(choice.duration)] += 1;
            dynamics.weights[dynamics.keys.indexOf(choice.dynamic)] += 1;
        }

        if (position === "top") {
            score.topGroup
                .transition()
                .duration(300)
                .attr("transform", translateSelectedCell);
            score.bottomGroup
                .transition()
                .duration(300)
                .style("opacity", 0);
        } else {
            score.bottomGroup
                .transition()
                .duration(300)
                .attr("transform", translateSelectedCell);
            score.topGroup
                .transition()
                .duration(300)
                .style("opacity", 0);
        }

        VS.score.schedule(2000, createChoices);
    }
}


/**
 * Create cells
 */
function translateTopCell() {
    return "translate(" +
        (score.center.x - score.cell.halfSize) + ", " +
        (score.center.y - score.cell.size - score.cell.halfSize) + ")";
}

function translateBottomCell() {
    return "translate(" +
        (score.center.x - score.cell.halfSize) + ", " +
        (score.center.y + score.cell.halfSize) + ")";
}

function translateSelectedCell() {
    return "translate(" +
        (score.center.x - score.cell.halfSize) + ", " +
        (score.center.y - score.cell.halfSize) + ")";
}

score.svg = d3.select(".main")
    .attr("width", score.width)
    .attr("height", score.height);

score.topGroup = score.svg.append("g")
    .attr("transform", translateTopCell)
    .on("click", function() {
        makeChoice("top");
    });
score.bottomGroup = score.svg.append("g")
    .attr("transform", translateBottomCell)
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

createChoices(); // initial choices


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
