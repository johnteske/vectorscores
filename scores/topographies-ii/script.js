---
layout: compress-js
---

var main = d3.select(".main"),
    topo = main.append("g"),
    width = 480,
    tileWidthHalf = 24,
    tileHeightHalf = tileWidthHalf * 0.5,
    topoScore,
    symbolOffsets = {
        0.5: { x: -0.025, y: -0.25 },
        1: { x: -0.175, y: 0 },
        2:  { x: -0.175, y: 0 },
        ".": { x: -0.0625, y: 0.0625 },
        ">": { x: -0.1625, y: 0.125 },
        "-": { x: -0.1625, y: 0.03125 }
    };

var symbols = Object.assign(VS.dictionary.Bravura.durations.stemless, VS.dictionary.Bravura.articulations);

main.style("width", width + "px")
    .style("height", width + "px");

{% include_relative _score.js %}

function drawScore(scoreFragment, x, y) {
    var documentFragment = document.createDocumentFragment(),
        rows = scoreFragment.length,
        cols = scoreFragment[0].length;

    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            var symbolKey = scoreFragment[row][col];

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
                .attr("dx", offsets.x + "em")
                .attr("dy", offsets.y + "em")
                .attr("transform", function() {
                    return "translate(" +
                        ((x + (col - row)) * tileWidthHalf) + ", " +
                        ((y + (col + row)) * tileHeightHalf) + ")";
                });
        }
    }

    topo.node().appendChild(documentFragment);
}
topoScore = createScoreFragment(8, 8);
drawScore(topoScore, 0, 0);
// drawScore(createScoreFragment(8, 1), 7, 7);

topo.attr("transform", "translate(240,120)");
