---
layout: compress-js
---

var TrashFire = (function() {
    var tf = {};

    tf.view = {
        width: 480,
        height: 480
    };

    tf.svg = d3.select(".main")
        .attr("width", tf.view.width)
        .attr("height", tf.view.height);

    tf.wrapper = tf.svg.append("g");

    tf.dumpster = {
        y: 200
    };

    return tf;
})();

var layout = {
    width: TrashFire.view.width,
    height: TrashFire.view.height,
    margin: {},
    main: d3.select("main")
};

{% include_relative _dumpster.js %}
{% include_relative _trash.js %}
{% include_relative _spike.js %}
{% include_relative _noise.js %}
{% include_relative _score.js %}

VS.score.stopCallback = function() {
    trash = [];
    TrashFire.noiseLayer.remove(0); // calls updateTrash();
    dumpsterShake();
};

/**
 * Resize
 */
function resize() {
    var main = layout.main;

    var w = layout.main.width = parseInt(main.style("width"), 10);
    var h = layout.main.height = parseInt(main.style("height"), 10);

    var scaleX = VS.clamp(w / layout.width, 0.25, 2);
    var scaleY = VS.clamp(h / layout.height, 0.25, 2);

    layout.scale = Math.min(scaleX, scaleY);

    layout.margin.left = (w * 0.5) - ((layout.width * 0.5) * layout.scale);
    layout.margin.top = (h * 0.5) - ((layout.height * 0.5) * layout.scale);

    TrashFire.wrapper.attr("transform", "translate(" + layout.margin.left + "," + layout.margin.top + ") scale(" + layout.scale + "," + layout.scale + ")");
}

d3.select(window).on("resize", resize);

d3.select(window).on("load", resize);
