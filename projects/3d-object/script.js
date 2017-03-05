// var scoreMap = [
//     0, 0, 0, 0,
//     0, 1, 1, 1,
//     0, 1, 1, 0,
//     0, 1, 0, 0
// ];

var circle = {
    radius: 32,
    x: 240,
    y: 240
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
performer.setAngle(45);
performer.positionIndicator = d3.select(".main")
    .append("circle")
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
d3.select(".main")
    .style("width", "480px")
    .style("height", "480px")
    .append("circle")
        .attr("cx", circle.x)
        .attr("cy", circle.y)
        .attr("r", circle.radius);
