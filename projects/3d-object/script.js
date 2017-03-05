// var scoreMap = [
//     0, 0, 0, 0,
//     0, 1, 1, 1,
//     0, 1, 1, 0,
//     0, 1, 0, 0
// ];

var indicator = d3.select(".indicator")
    .style("width", "80px")
    .style("height", "80px");

var circle = {
    radius: 32,
    x: 40,
    y: 40
};

/**
 * setAngle accepts degrees, saves value as radians
 **/
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
            _point.x = circle.x + (circle.radius * Math.cos(_angle));
            _point.y = circle.y + (circle.radius * Math.sin(_angle));
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
    indicator.append("circle")
        .classed("performer", 1)
        .attr("cx", performer.x())
        .attr("cy", performer.y())
        .attr("r", 4);

// TODO also allow performer to set angle by clicking/touching, dragging the indicator
var performerAngleInput = document.getElementById("performer-angle");
performerAngleInput.addEventListener("change", function() {
        performer.setAngle(performerAngleInput.value);
        performer.positionIndicator
            .attr("cx", performer.x())
            .attr("cy", performer.y());
    });

// circle
indicator.append("circle")
    .attr("cx", circle.x)
    .attr("cy", circle.y)
    .attr("r", circle.radius);

// "front" indicator (stage or agreed upon origin)
indicator.append("path")
    .attr("d",
        "M" + circle.x + "," + (circle.y - circle.radius - 8) +
        "L" + circle.x + "," + (circle.y - circle.radius + 8)
    );
