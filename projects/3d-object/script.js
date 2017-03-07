---
---
// generate (placeholder) score
{% include_relative _score.js %}

function rando() {
    return VS.getItem([3, 4, 5]);
}
var scoreMap = createScore(rando(), rando());

var main = d3.select(".main")
    .style("width", "240px")
    .style("height", "240px");

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
