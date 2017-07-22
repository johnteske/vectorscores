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

var durations = VS.dictionary.Bravura.durations.stemless;

var symbols = [],
    symbolWeights = [];

for (var prop in durations) {
    if (durations.hasOwnProperty(prop)) {
        symbols.push(prop);
        symbolWeights.push(1);
    }
}

function getSymbol() {
    return VS.getWeightedItem(symbols, symbolWeights);
}

function makeChoice(position) {
    // update symbol weights
    if (position) {
        var choice = score.choices[position],
            index = symbols.indexOf(choice);
        symbolWeights[index] += 1;
    }

    // debug
    console.log(symbols);
    console.log(symbolWeights);

    // make new choices
    score.choices.top = getSymbol();
    score.choices.bottom = getSymbol();

    score.topGroup.select("text")
        .text(durations[score.choices.top]);
    score.bottomGroup.select("text")
        .text(durations[score.choices.bottom]);
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
    .attr("x", score.cell.halfSize)
    .attr("y", score.cell.halfSize);
score.bottomGroup.append("text")
    .attr("x", score.cell.halfSize)
    .attr("y", score.cell.halfSize);

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
