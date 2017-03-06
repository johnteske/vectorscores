---
---
// generate (placeholder) score
{% include_relative _score.js %}
var scoreMap = createScore(5, 4);

var main = d3.select(".main")
    .style("width", "240px")
    .style("height", "240px");

var indicator = d3.select(".indicator svg")
    .style("width", "80px")
    .style("height", "80px");

var circle = {
    radius: 32,
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
// performer.angleIndicator =
//     indicator.append("path")
//         .classed("performer", 1)
//         .attr("d",
//             "M" + performer.x() + "," + performer.y() +
//             "L" + circle.x + "," + circle.y // TODO: don't draw the full length, only an 8px arrow
//         );

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

// draw score
var scoreRadius = 8; // give the score a size in relation to performer
var scoreDemoGroup =
    main.append("g")
        .attr("transform", "translate(88, 88)");
// draw performer circle
scoreDemoGroup.append("circle")
    .style("opacity", 0.25)
    .attr("cx", circle.x)
    .attr("cy", circle.y)
    .attr("r", circle.radius);
// draw performer position
performer.demoPosition = scoreDemoGroup.append("circle")
    .classed("performer", 1)
    .attr("r", 3)
    .attr("cx", performer.x())
    .attr("cy", performer.y());
for (var row = 0; row < scoreMap.length; row++) {
    for (var col = 0; col < scoreMap[row].length; col++) {
        var thisPoint = scoreMap[row][col];
        var pointOffset = circle.radius - scoreRadius;
        // display scoreMap, for reference only
        scoreDemoGroup.append("circle")
            .attr("r", 1)
            // .attr("r", 3)
            // TODO make sure these offsets work with a score of any size
            .style("fill", function() { return thisPoint ? "grey" : "none"; })
            .attr("cx", pointOffset + (col * 8))
            .attr("cy", pointOffset + (row * 8));
    }
}

/**
 *  HTML input control
 */

// TODO also allow performer to set angle by clicking/touching, dragging the indicator
var performerAngleInput = document.getElementById("performer-angle");

performerAngleInput.addEventListener("change", function() {
     performer.setAngle(performerAngleInput.value);
     performer.positionIndicator
         .attr("cx", performer.x())
         .attr("cy", performer.y());
     performer.demoPosition
         .attr("cx", performer.x())
         .attr("cy", performer.y());
});
