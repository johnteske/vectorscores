---
---
// generate (placeholder) score
{% include_relative _score.js %}
var scoreMap = createScore(5, 4);

var main = d3.select(".main")
    .style("width", "240px")
    .style("height", "240px");

var indicator = {
    container: d3.select(".indicator svg")
        .style("width", "80px")
        .style("height", "80px")
};

var circle = {
    r: 32,
    x: 40,
    y: 40
};

/**
 *  setAngle accepts degrees, saves value as radians
 */
function Performer() {
    var _angle,
        _point = {};

    return {
        setAngle: function(newAngle) {
            // substract 90 degress so origin is top,
            // then convert to radians
            _angle = (newAngle - 90) * (Math.PI / 180);
            // TODO these points are pixels, not relevant to the score size
            // I'll need both to display the indicator and the score
            _point.x = circle.x + (circle.r * Math.cos(_angle));
            _point.y = circle.y + (circle.r * Math.sin(_angle));
        },
        getAngle: function() {
            return _angle;
        },
        x: function() {
            return _point.x;
        },
        y: function() {
            return _point.y;
        }
    };
}

var performer = new Performer;
// TODO allow this to be set by query string on load,
// also update query string so bookmarks/share/reloads retain current settings
performer.setAngle(45);
performer.positionIndicator =
    indicator.container.append("circle")
        .classed("performer", 1)
        .attr("cx", performer.x())
        .attr("cy", performer.y())
        .attr("r", 4);

// circle
indicator.container.append("circle")
    .attr("cx", circle.x)
    .attr("cy", circle.y)
    .attr("r", circle.r);

// "front" indicator (stage or agreed upon origin)
indicator.container.append("path")
    .attr("d",
        "M" + circle.x + "," + (circle.y - circle.r - 8) +
        "L" + circle.x + "," + (circle.y - circle.r + 8)
    );

/**
 *  HTML input control
 *  TODO also allow performer to set angle by clicking/touching, dragging the indicator
 */

var performerAngleInput = document.getElementById("performer-angle");

performerAngleInput.addEventListener("change", function() {
     performer.setAngle(performerAngleInput.value);
     performer.positionIndicator
         .attr("cx", performer.x())
         .attr("cy", performer.y());
});
