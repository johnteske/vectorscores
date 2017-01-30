---
---
var main = d3.select(".main"),
    topo = main.append("g"),
    width = 480,
    // height = 480,
    // rows = 8,
    // cols = 8,
    tileWidthHalf = 16,
    tileHeightHalf = 8,
    topoScore,
    symbols = {
        0: ".",
        1: ">",
        2: "-"
    };

main.style("width", width + "px")
    .style("height", width + "px");

{% include_relative _score.js %}

function drawScore(scoreFragment, x, y) {
    var documentFragment = document.createDocumentFragment(),
        rows = scoreFragment.length,
        cols = scoreFragment[0].length;

    for(var i = 0; i < rows; i++){ // row
        for(var j = 0; j < cols; j++){ // col
            d3.select(documentFragment).append("svg:text")
            .text(function() {
                return symbols[scoreFragment[i][j]];
            })
            .attr("transform", function() {
                return "translate(" +
                    ((x + (j - i)) * tileWidthHalf) + ", " +
                    ((y + (j + i)) * tileHeightHalf) + ")";
            });
        }
    }

    topo.node().appendChild(documentFragment);
}
topoScore = createScoreFragment(8,7);
drawScore(topoScore, 0, 0);
drawScore(createScoreFragment(8,1), 7,7);

topo.attr("transform", "translate(240,120)");
