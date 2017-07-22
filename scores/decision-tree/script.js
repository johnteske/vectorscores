---
layout: compress-js
---
var score = {
    width: 320,
    height: 320,
    choices: {}
};

score.center = {
    x: score.width * 0.5,
    y: score.height * 0.5
}

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

score.svg = d3.select(".main")
    .attr("width", score.width)
    .attr("height", score.height);

score.topGroup = score.svg.append("g")
    .attr("transform", "translate(" +
        (score.center.x - 22) + ", " +
        (score.center.y - 44 - 22) + ")")
    .on("click", function() {
        makeChoice('top');
    });
score.topGroup.append("rect")
    .attr("width", 44)
    .attr("height", 44);

score.bottomGroup = score.svg.append("g")
    .attr("transform", "translate(" +
        (score.center.x - 22) + ", " +
        (score.center.y + 22) + ")")
    .on("click", function() {
        makeChoice('bottom');
    });
score.bottomGroup.append("rect")
    .attr("width", 44)
    .attr("height", 44);

score.topGroup.append("text")
    .attr("x", 22)
    .attr("y", 22);
score.bottomGroup.append("text")
    .attr("x", 22)
    .attr("y", 22);

makeChoice();
