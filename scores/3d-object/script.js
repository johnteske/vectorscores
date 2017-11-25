---
layout: compress-js
---

// generate (placeholder) score
{% include_relative _score.js %}
{% include_relative _matrices.js %}

var score = {
    width: VS.getItem([3, 4, 5]),
    height: VS.getItem([3, 4, 5]),
    container: d3.select('.main')
        .attr('width', 640)
        .attr('height', 640)
        .append('g')
};
score.center = {
    x: score.width * 0.5 - 0.5,
    y: score.height * 0.5 - 0.5
};
score.radius = Math.sqrt(Math.pow(score.width, 2) + Math.pow(score.height, 2)); // distance of player from center of score
score.obj = createScore();

/**
 * setAngle accepts degrees, saves value as radians
 */
function Performer() {
    var _angle,
        _position = {};

    return {
        setAngle: function(newAngle) {
            // substract 90 degress so origin is top, then convert to radians
            _angle = (newAngle - 90) * (Math.PI / 180);

            _position = {
               x: score.center.x + (score.radius * Math.cos(_angle)),
               y: score.center.y + (score.radius * Math.sin(_angle))
            };

            return _angle;
        },
        getAngle: function() {
            return _angle;
        },
        getPosition: function() {
            return _position;
        },
        get: function() {
            return {
                x: _position.x,
                y: _position.y,
                angle: _angle
            };
        }
    };
}

var performer = new Performer();
// TODO allow this to be set by query string on load,
// also update query string so bookmarks/share/reloads retain current settings
performer.setAngle(45);

{% comment %}{% include_relative _indicator.js %}{% endcomment %}

{% include_relative _render.js %}
render();
