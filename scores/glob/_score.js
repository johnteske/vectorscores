var score = [];

for(var i = 0; i < scoreLength; i++) {
    score.push(VS.getItem(["glob", "chord", "rhythm"]));
    VS.score.add(i * transitionTime.long, moveAndUpdate, [transitionTime.long, score[i]]);
}

// final event
VS.score.add(scoreLength * transitionTime.long, function() {
    d3.select(".pc-set")
        .transition().duration(transitionTime.short)
        .style("opacity", "0");
});

glob.move(0, score[0]);
