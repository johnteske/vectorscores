---
layout: compress-js
---
var score = {
    width: 320,
    height: 320,
    cell: {
        size: 90
    },
    choices: {},
    selected: false,
    interval: 10000,
    weightScale: 5 // TODO increase over time/score pointer?
};

score.partWeight = score.weightScale; // init

score.center = {
    x: score.width * 0.5,
    y: score.height * 0.5
};

score.cell.halfSize = score.cell.size * 0.5;

/**
 * Symbols and choice
 */

{% include_relative _properties.js %}

var durations = VS.dictionary.Bravura.durations.stemless;
var dynamics = VS.dictionary.Bravura.dynamics;

makePropertyObj("duration", Object.keys(durations));
makePropertyObj("dynamic", Object.keys(dynamics));
makePropertyObj("pitchClasses", [[0, 3, 7], [0, 4, 7]]);

function transformCell(selection, position, selected) {
    var opacity = (typeof selected !== "undefined" && !selected) ? 0 : 1;

    var translateFn;
    if (selected) {
        translateFn = translateSelectedCell;
    } else {
        translateFn = position === "top" ? translateTopCell : translateBottomCell;
    }

    selection.transition().duration(300)
        .style("opacity", opacity)
        .attr("transform", translateFn);
}

function updateChoices() {
    var PC = VS.pitchClass,
        choices = score.choices;

    choices.top = createChoice();
    choices.bottom = createChoice();

    function pcText(set) {
        set = set.split(",");
        set = PC.transpose(set, "random").sort(function(a, b) { return a - b; });
        return "{" + PC.format(set) + "}";
    }

    score.topGroup.call(transformCell, "top");
    score.topGroup.select(".duration")
        .text(durations[choices.top.duration]);
    score.topGroup.select(".dynamic")
        .text(dynamics[choices.top.dynamic]);
    score.topGroup.select(".pitch-classes")
        .text(pcText(choices.top.pitchClasses));

    score.bottomGroup.call(transformCell, "bottom");
    score.bottomGroup.select(".duration")
        .text(durations[choices.bottom.duration]);
    score.bottomGroup.select(".dynamic")
        .text(dynamics[choices.bottom.dynamic]);
    score.bottomGroup.select(".pitch-classes")
        .text(pcText(choices.bottom.pitchClasses));

    score.selected = false;
}

function selectCell(position) {
    if (!score.selected && VS.score.playing) {

        score.selected = true; // disable selection until new choices

        // update symbol weights
        var choice = score.choices[position];
        updateWeights(choice);

        score.topGroup.call(transformCell, "bottom", position === "top");
        score.bottomGroup.call(transformCell, "bottom", position === "bottom");
    }
}


/**
 * Create cells
 */
function translateTopCell() {
    return "translate(" +
        (score.center.x - score.cell.halfSize) + ", " +
        (score.center.y - score.cell.size - (score.cell.halfSize * 0.5)) + ")";
}

function translateBottomCell() {
    return "translate(" +
        (score.center.x - score.cell.halfSize) + ", " +
        (score.center.y + (score.cell.halfSize * 0.5)) + ")";
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
    .attr("transform", translateSelectedCell)
    .on("click", function() {
        selectCell("top");
    });
score.bottomGroup = score.svg.append("g")
    .attr("transform", translateSelectedCell)
    .on("click", function() {
        selectCell("bottom");
    });

score.topGroup.append("rect")
    .attr("width", score.cell.size)
    .attr("height", score.cell.size);
score.bottomGroup.append("rect")
    .attr("width", score.cell.size)
    .attr("height", score.cell.size);

score.topGroup.append("text")
    .attr("class", "duration bravura")
    .attr("x", score.cell.halfSize)
    .attr("y", score.cell.halfSize);
score.topGroup.append("text")
    .attr("class", "dynamic bravura")
    .attr("x", score.cell.halfSize)
    .attr("y", score.cell.size - 5)
    .attr("dy", -5);
score.topGroup.append("text")
    .attr("class", "pitch-classes monospace")
    .attr("dy", "-0.62em");
score.bottomGroup.append("text")
    .attr("class", "duration bravura")
    .attr("x", score.cell.halfSize)
    .attr("y", score.cell.halfSize);
score.bottomGroup.append("text")
    .attr("class", "dynamic bravura")
    .attr("x", score.cell.halfSize)
    .attr("y", score.cell.size - 5)
    .attr("dy", -5);
score.bottomGroup.append("text")
    .attr("class", "pitch-classes monospace")
    .attr("dy", "-0.62em");

function clearChoices() {
    // TODO also clear choice weights

    score.topGroup.call(transformCell, "top");
    score.topGroup.selectAll(".bravura").text("");
    score.topGroup.select(".pitch-classes").text("a");

    score.bottomGroup.call(transformCell, "bottom");
    score.bottomGroup.selectAll(".bravura").text("");
    score.bottomGroup.select(".pitch-classes").text("b");
}

clearChoices();

for (var i = 0; i < 9; i++) {
    VS.score.add(i * score.interval, updateChoices, []);
}

VS.score.stopCallback = clearChoices;

VS.score.stepCallback = function () {
    if (VS.score.pointer === 0) {
        clearChoices();
    } else if (VS.score.pointer < VS.score.getLength() - 1) {
        updateChoices();
    }
};

VS.WebSocket.messageCallback = function(data) {
    if (data.type === "ws" && data.content === "connections") {
        score.partWeight = (1 / data.connections) * score.weightScale;
    }
};
VS.WebSocket.connect();

/**
 * Keyboard control
 */

function keydownListener(event) {
    if (event.defaultPrevented) { return; }

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
