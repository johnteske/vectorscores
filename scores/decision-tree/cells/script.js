---
layout: compress-js
---
var score = {
    width: 320,
    height: 480,
    cell: {
        size: 90,
        buffer: 30
    },
    nEvents: 8,
    interval: 10000,
    // TODO increase over time/score pointer?
    // TODO scale according to number of choices per param?
    weightScale: 5
};

score.center = {
    x: score.width * 0.5,
    y: score.height * 0.5
};

score.cell.halfSize = score.cell.size * 0.5;

score.partWeight = score.weightScale; // init

score.choices = {};
score.selected = false;

/**
 * Symbols and choice
 */

{% include_relative _params.js %}

var durations = VS.dictionary.Bravura.durations.stemless;
var dynamics = VS.dictionary.Bravura.dynamics;
var phrases = [
    durations["1"],
    durations["1"] + " " + durations["1"],
    durations["1"] + " " + durations["1"] + " " + durations["1"],
    durations["1"] + " " + durations["1"] + " " + durations["1"] + " " + durations["1"],
    "rest" // "\ue4e5"
];

params.add("duration", Object.keys(durations));
params.add("dynamic", Object.keys(dynamics).filter(function(k) {
    return k !== "n";
}));
params.add("pitchClasses", VS.trichords);
params.add("phrase", phrases);
// params.add("intervalClasses", [1, 2, 3, 4, 5, 6]);

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
        // .transition()
        // .style("cursor", selected ? "default" : "pointer");
}

function formatPCSet(setString) {
    var PC = VS.pitchClass,
        formatted = "";

    if (setString) {
        var set = setString.split(",");
        set = PC.transpose(setString.split(","), "random").sort(function(a, b) { return a - b; });
        formatted = "{" + PC.format(set) + "}";
    }

    return formatted;
}

function updateChoices() {
    var choices = score.choices;

    choices.top = params.createChoice();
    choices.bottom = params.createChoice();

    function updateCell(selection, choice) {
        var isRest = choice.phrase === "rest";

        if (isRest) {
            choice.pitchClasses = "";
            choice.duration = "";
            // choice.phrase = "rest";
            choice.dynamic = "";
        }

        selection.select(".pitch-classes")
            .text(formatPCSet(choice.pitchClasses));
        selection.select("circle")
            .style("opacity", isRest ? 0 : 1);
        selection.select(".duration")
            .text(durations[choice.duration]);
        selection.select(".phrase")
            .text(isRest ? "\ue4e5" : choice.phrase);
        selection.select(".dynamic")
            .text(dynamics[choice.dynamic]);
    }

    score.topGroup.call(transformCell, "top");
    score.topGroup.call(updateCell, choices.top);

    score.bottomGroup.call(transformCell, "bottom");
    score.bottomGroup.call(updateCell, choices.bottom);

    score.selected = false;
}

function selectCell(position) {
    if (!score.selected && VS.score.playing) {

        score.selected = true; // disable selection until new choices

        // update symbol weights
        var choice = score.choices[position];
        params.updateWeights(choice, score.partWeight);

        score.topGroup.call(transformCell, "bottom", position === "top");
        score.bottomGroup.call(transformCell, "bottom", position === "bottom");

        VS.WebSocket.send({
            type: "choice",
            content: choice
        });

        debugChoices();
    }
}

var debugChoices = (function () {
    var debug = VS.getQueryString("debug") == 1 || false,
        el = document.getElementsByClassName("debug")[0];

    return debug ? function() {
        el.innerHTML = "weight: " + score.partWeight + "<br />" +
            params.getWeights().split("\n").join("<br />");
    } : VS.noop;
})();

/**
 * Create cells
 */
function translateTopCell() {
    return "translate(" +
        (score.center.x - score.cell.halfSize) + ", " +
        (score.center.y - score.cell.size - score.cell.buffer) + ")";
}

function translateBottomCell() {
    return "translate(" +
        (score.center.x - score.cell.halfSize) + ", " +
        (score.center.y + score.cell.buffer) + ")";
}

function translateSelectedCell() {
    return "translate(" +
        (score.center.x - score.cell.halfSize) + ", " +
        (score.center.y - score.cell.halfSize) + ")";
}

score.svg = d3.select(".main")
    .attr("width", score.width)
    .attr("height", score.height);

function createCell(selection) {
    selection
        .attr("transform", translateSelectedCell)
        .style("opacity", 0);

    selection.append("rect")
        .attr("class", "phrase-container")
        .attr("width", score.cell.size)
        .attr("height", score.cell.size);

    selection.append("text")
        .attr("class", "pitch-classes monospace")
        .attr("dy", "-1em");

    var r = (22 * 1.5) / 2;
    selection.append("circle")
        .attr("cx", score.cell.size - r)
        .attr("cy", -1.5 * r)
        .attr("r", r)
        .attr("stroke", "black")
        .attr("fill", "none");
    selection.append("text")
        .attr("class", "duration bravura")
        .attr("text-anchor", "middle")
        .attr("x", score.cell.size - r)
        .attr("y", -0.5 * r)
        .attr("dy", "-1em");

    selection.append("text")
        .attr("class", "phrase bravura")
        .attr("x", score.cell.halfSize)
        .attr("y", score.cell.halfSize);

    selection.append("text")
        .attr("class", "dynamic bravura")
        .attr("x", score.cell.halfSize)
        .attr("y", score.cell.size - 5)
        .attr("dy", -5);
}

score.topGroup = score.svg.append("g")
    .call(createCell)
    .on("click", function() {
        selectCell("top");
    });

score.bottomGroup = score.svg.append("g")
    .call(createCell)
    .on("click", function() {
        selectCell("bottom");
    });

function clearChoices() {
    // TODO also clear choice weights

    score.topGroup.call(transformCell, "top");
    score.topGroup.selectAll(".bravura").text("");
    score.topGroup.select(".pitch-classes").text("{}");

    score.bottomGroup.call(transformCell, "bottom");
    score.bottomGroup.selectAll(".bravura").text("");
    score.bottomGroup.select(".pitch-classes").text("{}");
}

clearChoices();

for (var i = 0; i < score.nEvents + 1; i++) {
    VS.score.add(i * score.interval, updateChoices, []);
}

{% include_relative _controls.js %}
