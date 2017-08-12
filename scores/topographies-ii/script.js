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
 * Test to find/create unique points
 */
var unique = topoData.filter(function(d) {
    return d.height === score.range.min || d.height === score.range.max;
});
unique[Math.floor(Math.random() * unique.length)].unique = true;

function drawScore(scoreFragment, x, y) {
    var documentFragment = document.createDocumentFragment(),
        rows = scoreFragment.length,
        cols = scoreFragment[0].length;

    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            var point = scoreFragment[row][col];
            var symbolIndex = point.heightIndex + 4;
            var symbolKey = symbolScale[symbolIndex];

            // to help center symbols with offsets
            // d3.select(documentFragment).append("svg:path")
            //     .attr("stroke", "red")
            //     .attr("stroke-width", 1)
            //     .attr("d", function() {
            //         var px = ((x + (col - row)) * tileWidthHalf),
            //             py = ((y + (col + row)) * tileHeightHalf)
            //         return "M" + px + " " + (py - 5) +
            //             " L" + px + " " + (py + 5) +
            //             " M" + (px - 5) + " " + py +
            //             " L" + (px + 5) + " " + py;
            //     });

            var offsets = symbolOffsets[symbolKey];

            d3.select(documentFragment).append("svg:text")
                .text(symbols[symbolKey])
                .style("fill", point.unique ? "blue" : "black")
                .attr("dx", offsets.x + "em")
                .attr("dy", offsets.y + "em")
                .attr("transform", function() {
                    return "translate(" +
                        ((x + (col - row)) * tileWidthHalf) + ", " +
                        ((y + (col + row)) * tileHeightHalf - (point.height * 5)) + ")";
                });
        }
    }

    topo.node().appendChild(documentFragment);
}

topoScore = rowMajorOrderToGrid(topoData, score.width, 8, 8);
drawScore(topoScore, 0, 0);
// drawScore(createScoreFragment(8, 1, score.width), 7, 7); // needs offset to work properly

topo.attr("transform", "translate(320,120)");
