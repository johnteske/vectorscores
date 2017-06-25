---
---
var main = d3.select(".main"),
    topo = main.append("g"),
    width = 480,
    tileWidthHalf = 32,
    tileHeightHalf = tileWidthHalf * 0.5,
    topoScore,
    testDur = [0.5, 1, 2],
    testArt = [".", ">", "-"];

var durations = VS.dictionary.Bravura.durations.stemless;
var articulations = VS.dictionary.Bravura.articulations;

main.style("width", width + "px")
    .style("height", width + "px");

{% include_relative _score.js %}

function drawScore(scoreFragment, x, y) {
    var documentFragment = document.createDocumentFragment(),
        rows = scoreFragment.length,
        cols = scoreFragment[0].length;

    for(var row = 0; row < rows; row++){
        for(var col = 0; col < cols; col++){
            d3.select(documentFragment).append("svg:text")
            .text(function(d, i) {
                var symbol;
                if (Math.random() > (col / cols)) {
                    symbol = articulations[testArt[scoreFragment[row][col]]];
                } else {
                    symbol = durations[testDur[scoreFragment[row][col]]];
                }
                return symbol;
            })
            .attr("transform", function() {
                return "translate(" +
                    ((x + (col - row)) * tileWidthHalf) + ", " +
                    ((y + (col + row)) * tileHeightHalf) + ")";
            });
        }
    }

    topo.node().appendChild(documentFragment);
}
topoScore = createScoreFragment(8, 7);
drawScore(topoScore, 0, 0);
drawScore(createScoreFragment(8, 1), 7, 7);

topo.attr("transform", "translate(240,120)");
