/**
 * Visualize score and performer positions, to aid in creating the final result
 * Make it pixel-perfect, then scale up
 */
var miniScore = {
    element: d3.select("#mini-score")
        .attr("width", 150)
        .attr("height", 150)
};
miniScore.container = miniScore.element.append("g");

miniScore.container.append("circle")
     .style("opacity", 0.25)
     .style("stroke-width", 0.5)
     .attr("cx", score.center.x)
     .attr("cy", score.center.y)
     .attr("r", score.radius);

/** basically identical to indicator.positionIndicator */
 // performer position
 miniScore.positionIndicator =
     miniScore.container.append("circle")
         .classed("performer", 1)
         .style("stroke-width", 0.5)
         .attr("r", 0.5);

 miniScore.updatePosition = function(angle) {
     var pos = performer.getPosition();
     miniScore.positionIndicator
         .attr("cx", pos.x)
         .attr("cy", pos.y);
     document.getElementById("performer").innerHTML =
        "\n\tx: " + pos.x + ",\n\ty: " + pos.y;
     document.getElementById("score-center").innerHTML =
        "\n\tx: " + score.center.x + ",\n\ty: " + score.center.y;
 };
 miniScore.updatePosition(performer.getAngle());

/**
 * mini-score
 */
for (var row = 0; row < score.height; row++) {
    for (var col = 0; col < score.width; col++) {
        var thisPoint = score.obj[row][col];
        miniScore.container.append("circle")
            .attr("r", 0.5)
            .style("stroke", "none")
            .style("fill", function() { return colors[thisPoint]; })
            .attr("cx", col)
            .attr("cy", row);
    }
}

miniScore.container
    .attr("transform",
        "translate(" +
            (miniScore.element.attr("width") * 0.5) + "," +
            (miniScore.element.attr("height") * 0.5) + ") " +
        "scale(" + 8 + ")"
    );
