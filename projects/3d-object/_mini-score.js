/**
 * Visualize score and performer positions, to aid in creating the final result
 */

var miniScore = {
    container: main.append("g")
        .attr("transform", "translate(88, 88)"),
    circle: {
        r: 32,
        x: 40,
        y: 40
    }
};

miniScore.container.append("circle")
     .style("opacity", 0.25)
     .attr("cx", miniScore.circle.x)
     .attr("cy", miniScore.circle.y)
     .attr("r", miniScore.circle.r);

/** basically identical to indicator.positionIndicator */
 // performer position
 miniScore.positionIndicator =
     miniScore.container.append("circle")
         .classed("performer", 1)
         .attr("r", 4);

 miniScore.updatePosition = function(angle) {
     miniScore.positionIndicator
         .attr("cx", miniScore.circle.x + (miniScore.circle.r * Math.cos(angle)))
         .attr("cy", miniScore.circle.y + (miniScore.circle.r * Math.sin(angle)));
 };
 miniScore.updatePosition(performer.getAngle());

/**
 * mini-score
 */
 for (var row = 0; row < scoreMap.length; row++) {
     for (var col = 0; col < scoreMap[row].length; col++) {
         var thisPoint = scoreMap[row][col];
         var pointOffset = miniScore.circle.r; // "score radius"
         // display scoreMap, for reference only
         miniScore.container.append("circle")
             .attr("r", 1)
             // .attr("r", 3)
             // TODO make sure these offsets work with a score of any size
             .style("fill", function() { return thisPoint ? "grey" : "none"; })
             .attr("cx", pointOffset + (col * 8))
             .attr("cy", pointOffset + (row * 8));
     }
 }
