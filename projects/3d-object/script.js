---
---
// generate (placeholder) score
{% include_relative _score.js %}

var score = {
    width: VS.getItem([3, 4, 5]),
    height: VS.getItem([3, 4, 5])
}
score.obj = createScore(score.width, score.height);

var main = d3.select(".main")
    .attr("width", 240)
    .attr("height", 240);

// debug
main.append("path")
    .style("stroke", "pink")
    .attr("d", "M120,0 L120,240 M240,120 L0,120");

/**
 * setAngle accepts degrees, saves value as radians
 */
function Performer() {
    var _angle;

    return {
        setAngle: function(newAngle) {
            // substract 90 degress so origin is top, then convert to radians
            _angle = (newAngle - 90) * (Math.PI / 180);
        },
        getAngle: function() {
            return _angle;
        }
    };
}

var performer = new Performer;
// TODO allow this to be set by query string on load,
// also update query string so bookmarks/share/reloads retain current settings
performer.setAngle(45);

{% include_relative _indicator.js %}
{% include_relative _mini-score.js %}
