---
layout: compress-js
---

var canvas = {
        width: 400,
        height: 400,
        center: 200
    },
    layout = {
        width: 240,
        margin: {}
    },
    transitionTime = {
        // long: 5000,
        short: 600
    },
    scoreLength = 12,
    textoffset = 5,
    debug = +VS.getQueryString("debug") === 1 || false,
    svg = d3.select(".main"),
    wrapper = svg.append("g");

transitionTime.long = 20000;
var globInterval = transitionTime.long;

// transitionTime.long = 5000;
// var globInterval = transitionTime.long * 3;

var durationDict = VS.dictionary.Bravura.durations.stemless;

{% include_relative _settings.js %}

{% include_relative _glob.js %}

var glob = new Glob(wrapper, { n: 20 });

glob.group.attr("transform",
    "translate(" + (canvas.center - 12) + ", " + canvas.center + ")"); // offset by ~half font size

var pitchClassSet = wrapper.append("text")
    .classed("pc-set", 1)
    .attr("x", canvas.center)
    .attr("y", canvas.width)
    .attr("dy", "-2em");

function moveAndUpdate(dur, type) {

    // eventually multiple globs
    glob.move(dur, type);

    var pcSet = VS.pitchClass.transpose(VS.getItem(VS.trichords), "random").map(function(pc) {
        return VS.pitchClass.format(pc, scoreSettings.pcFormat);
    });

    pitchClassSet
        .text(function() {
            return "{" + pcSet.join(", ") + "}";
        });
}

{% include_relative _score.js %}
{% include_relative _controls.js %}

moveAndUpdate(0, score[0]);

/**
 * Debug
 */
if(debug) {
    wrapper.append("circle")
        .attr("r", 12)
        .attr("cx", canvas.center)
        .attr("cy", canvas.center)
        .attr("fill", "none")
        .attr("stroke", "red");
}

/**
 * Resize
 */
d3.select(window).on("resize", resize);

function resize() {
    var main = d3.select("main");

    var w = parseInt(main.style("width"), 10);
    var h = parseInt(main.style("height"), 10);

    var scaleX = VS.clamp(w / canvas.width, 0.25, 3);
    var scaleY = VS.clamp(h / canvas.height, 0.25, 3);

    layout.scale = Math.min(scaleX, scaleY);

    layout.margin.left = (w * 0.5) - (canvas.width * 0.5 * layout.scale);
    layout.margin.top = (h * 0.5) - (canvas.height * 0.5 * layout.scale);

    wrapper.attr("transform", "translate(" + layout.margin.left + "," + layout.margin.top + ") scale(" + layout.scale + "," + layout.scale + ")");
}

resize();
