/**
 * Visualize performer position
 */

var indicator = {
    container: d3.select(".indicator svg")
        .style("width", "80px")
        .style("height", "80px"),
    circle: {
        r: 32,
        x: 40,
        y: 40
    }
};

// circle
indicator.container.append("circle")
    .attr("cx", indicator.circle.x)
    .attr("cy", indicator.circle.y)
    .attr("r", indicator.circle.r);

// "front" indicator (stage or agreed upon origin)
indicator.container.append("path")
    .attr("d",
        "M" + indicator.circle.x + "," + (indicator.circle.y - indicator.circle.r - 8) +
        "L" + indicator.circle.x + "," + (indicator.circle.y - indicator.circle.r + 8)
    );

// performer position
indicator.positionIndicator =
    indicator.container.append("circle")
        .classed("performer", 1)
        .attr("r", 4);

indicator.updatePosition = function(angle) {
    indicator.positionIndicator
        .attr("cx", indicator.circle.x + (indicator.circle.r * Math.cos(angle)))
        .attr("cy", indicator.circle.y + (indicator.circle.r * Math.sin(angle)));
};
indicator.updatePosition(performer.getAngle());

/**
 * HTML input control
 * TODO also allow performer to set angle by clicking/touching, dragging the indicator
 */

var performerAngleInput = document.getElementById("performer-angle");

performerAngleInput.addEventListener("change", function() {
     performer.setAngle(performerAngleInput.value);
     indicator.updatePosition(performer.getAngle());
});
