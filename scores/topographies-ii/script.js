---
layout: compress-js
---

var main = d3.select(".main"),
    topo = main.append("g"),
    // width = 480,
    tileWidthHalf = 24,
    tileHeightHalf = tileWidthHalf * 0.5,
    topoData,
    topoScore,
    score = {
        width: 8 // currently used in creation, not display
    },
    symbolOffsets = {
        // 0.25: { x: -0.025, y: -0.25 }, // TODO
        // 0.5: { x: -0.025, y: -0.25 },
        // 1: { x: -0.175, y: 0 },
        // 2:  { x: -0.175, y: 0 },
        ".": { x: -0.0625, y: 0.0625 },
        ">": { x: -0.1625, y: 0.125 },
        "-": { x: -0.1625, y: 0.03125 },
        //
        "-2": { x: -0.2, y: 0 }, // double flat
        "-1.5": { x: -0.225, y: 0 }, // three-quarter flat (backwards, forwards)
        "-1": { x: -0.1, y: 0 }, // flat
        "-0.5": { x: -0.1325, y: 0 }, // quarter flat (backwards)
        "0": { x: -0.0875, y: 0 }, // natural
        // "0.5":  "\ue282", // quarter sharp (single vertical stroke)
        // "1":    "\ue262", // sharp
        // "1.5":  "\ue283", // three-quarter sharp (three vertical strokes)
        // "2":    "\ue263"  // double sharp
    },
    symbolScale = ["-2", "-1.5", "-1", "-0.5", "0", "-", ">", "."]; // ["-", "-", ">", ".", 2, 1, 0.5, 0.25]

// var symbols = Object.assign(VS.dictionary.Bravura.durations.stemless, VS.dictionary.Bravura.articulations);
var symbols = Object.assign(VS.dictionary.Bravura.accidentals, VS.dictionary.Bravura.articulations);

main.style("width", 640 + "px")
    .style("height", 640 + "px");

{% include_relative _diamond-square.js %}
{% include_relative _score.js %}

score.range = getScoreRange(topoData);
topoData = createScoreFragment(topoData, score.width, 8, 8);

/**
 * x, y from i of row-major order
 */
function indexToCoordinates(i) {
    var y = Math.floor(i / score.width);
    var x = i - (y * score.width);

    return {
        x: x,
        y: y
    }
}

function coordinatesToIndex(x, y) {
    return (x & (score.width - 1)) + (y & (score.width - 1)) * score.width;
}

/**
 * Render score directly from row-major order data
 */
topo.selectAll("text")
    .data(topoData)
    .enter()
    .append("text")
    .attr("x", function(d, i) {
        var y = Math.floor(i / score.width);
        var x = i - (y * score.width)
        var xOffset = 0;
        return ((xOffset + (x - y)) * tileWidthHalf);
    })
    .attr("y", function(d, i) {
        var y = Math.floor(i / score.width);
        var x = i - (y * score.width)
        var yOffset = 0;
        return ((yOffset + (x + y)) * tileHeightHalf);
    })
    .text(function(d) {
        var symbolIndex = d.heightIndex + 4;
        var symbolKey = symbolScale[symbolIndex];
        return symbols[symbolKey];
    })
    .call(revealSymbols, 0);

topo.attr("transform", "translate(320,120)");

/**
 * Reveal
 */
function revealSymbols(selection, dur) {
    selection.transition().duration(dur)
        .attr("dy", function(d) {
            return d.revealed ? d.height * -5 : d.height * -2.5;
        })
        .style("opacity", function(d) {
            return d.revealed ? 1 : 0;
        });
}

function revealNearby() {
    // Gather revealed indices
    var revealedIndices = [];

    for (var i = 0; i < topoData.length; i++) {
        if (topoData[i].revealed) {
            revealedIndices.push(i);
        }
    }

    function setRevealed(x, y) {
        if (x > -1 && x < score.width && y > -1 && y < score.width) {
            topoData[coordinatesToIndex(x, y)].revealed = true;
        }
    }

    // Reveal surrounding indices
    for (var i = 0; i < revealedIndices.length; i++) {
        var index = revealedIndices[i],
            c = indexToCoordinates(index);

        setRevealed(c.x, c.y - 1); // top
        setRevealed(c.x + 1, c.y); // right
        setRevealed(c.x, c.y + 1); // bottom
        setRevealed(c.x - 1, c.y); // left

        setRevealed(c.x - 1, c.y - 1); // top left
        setRevealed(c.x + 1, c.y + 1); // bottom right
    }

    // Update map
    topo.selectAll("text").call(revealSymbols, 600);
}

/**
 * Populate score
 */
VS.score.preroll = 1000;

var addEvent = (function() {
    var time = 0;

    return function(fn, duration) {
        VS.score.add(time, fn);
        time += duration;
    };
})();

function randDuration() {
    return 1000; // + (Math.random() * 3000);
}
/**
 * Reveal a starting point
 */
addEvent(function() {
    var extrema = topoData.filter(function(d) {
        return d.height === score.range.min || d.height === score.range.max;
    });

    extrema[Math.floor(Math.random() * extrema.length)].revealed = true;

    topo.selectAll("text").call(revealSymbols, 600);
}, randDuration());

for (var i = 0; i < 11; i++) {
    addEvent(revealNearby, randDuration());
}
