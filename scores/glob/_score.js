/**
 * Score
 */
var score = [];

for(var i = 0; i < scoreLength; i++) {
    score.push(VS.getItem(["glob", "chord", "rhythm"]));
    VS.score.add(i * transitionTime.long, glob.move, [transitionTime.long, score[i]]);
}

// final event
VS.score.add(scoreLength * transitionTime.long, function() {
    d3.select(".pc-set")
        .transition().duration(transitionTime.short)
        .style("opacity", "0");
});

glob.move(0, score[0]);

/**
 * Controls
 */
 VS.score.preroll = 1000;

 VS.control.stepCallback = function() {
     glob.move(transitionTime.short, score[VS.score.pointer]);
 };

 VS.score.stopCallback = function() {
     glob.pitchSet
         .transition().duration(transitionTime.short)
         .style("opacity", "0");
     glob.children
         .transition().duration(transitionTime.short)
         .attr("transform", "translate(0, 0)");
 };
