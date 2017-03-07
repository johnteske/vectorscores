/**
 * Visualize score and performer positions, to aid in creating the final result
 * Make it pixel-perfect, then scale up
 */
var miniSVG = d3.select("#mini-score")
    .attr("width", 150)
    .attr("height", 150);

var miniScore = {
    container: miniSVG.append("g"),
    circle: {
        r: Math.sqrt( Math.pow(score.width, 2) + Math.pow(score.height, 2) )
    },
    performer: {}
};
miniScore.circle.x = miniScore.circle.r;
miniScore.circle.y = miniScore.circle.r;

miniScore.center = {
    x: miniScore.circle.r - (score.width * 0.5 - 0.5),
    y: miniScore.circle.r - (score.height * 0.5 - 0.5)
};

miniScore.container.append("circle")
     .style("opacity", 0.25)
     .style("stroke-width", 0.5)
     .attr("cx", miniScore.circle.x)
     .attr("cy", miniScore.circle.y)
     .attr("r", miniScore.circle.r);

/** basically identical to indicator.positionIndicator */
 // performer position
 miniScore.positionIndicator =
     miniScore.container.append("circle")
         .classed("performer", 1)
         .style("stroke-width", 0.5)
         .attr("r", 0.5);

 miniScore.updatePosition = function(angle) {
     miniScore.performer = {
        x: miniScore.circle.x + (miniScore.circle.r * Math.cos(angle)),
        y: miniScore.circle.y + (miniScore.circle.r * Math.sin(angle))
     };
     miniScore.positionIndicator
         .attr("cx", miniScore.performer.x)
         .attr("cy", miniScore.performer.y);
     document.getElementById("performer").innerHTML =
        "{\n\tx: " + miniScore.performer.x + ",\n\ty: " + miniScore.performer.y + " }";
     document.getElementById("score-center").innerHTML =
        "{\n\tx: " + miniScore.center.x + ",\n\ty: " + miniScore.center.y + " }";
 };
 miniScore.updatePosition(performer.getAngle());

/**
 * mini-score
 */
for (var row = 0; row < score.height; row++) {
    for (var col = 0; col < score.width; col++) {
        var thisPoint = score.obj[row][col];
        // display score.obj, for reference only
        miniScore.container.append("circle")
            .attr("r", 0.5)
            .style("stroke", "none")
            .style("fill", function() { return thisPoint ? "black" : "grey"; })
            // TODO make sure these offsets work with a score of any size
            .attr("cx", miniScore.center.x + col)
            .attr("cy", miniScore.center.y + row);
    }
}

var scale = 8;
miniScore.container
    .attr("transform",
        "translate(" +
            ( (miniSVG.attr("width") * 0.5) - (miniScore.circle.r * scale) ) + "," +
            ( (miniSVG.attr("height") * 0.5) - (miniScore.circle.r * scale) ) + ") " +
        "scale(" + scale + ")"
    );
