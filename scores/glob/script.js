---
layout: compress-js
---

var canvas = {
        margins: 20,
        maxWidth: 400,
        width: null,
        center: null
    },
    layout = {
        width: 240
    },
    transitionTime = {
        // long: 5000,
        short: 600
    },
    scoreLength = 12,
    textoffset = 5,
    debug = +VS.getQueryString("debug") === 1 || false,
    svg = d3.select(".main");

transitionTime.long = 20000;
var globInterval = transitionTime.long;

// transitionTime.long = 5000;
// var globInterval = transitionTime.long * 3;

var durationDict = VS.dictionary.Bravura.durations.stemless;

{% include_relative _settings.js %}

{% include_relative _glob.js %}

var glob = new Glob(svg, { n: 20 });

var pitchClassSet = svg.append("text")
    .classed("pc-set", 1)
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

// resize

d3.select(window).on("resize", resize);

function resize() {
    // update width
    canvas.width = Math.min(parseInt(d3.select("main").style("width"), 10), canvas.maxWidth);
    canvas.center = canvas.width * 0.5;
    var innerwidth = canvas.width - (canvas.margins * 2);

    svg
        .style("width", canvas.width + "px")
        .style("height", canvas.width + "px");

    glob.group.attr("transform",
        "translate(" + (canvas.center - 12) + ", " + canvas.center + ")" + // offset by ~half font size
        "scale(" + (canvas.width / layout.width) + "," + (canvas.width / layout.width) + ")"
        );

    pitchClassSet
        .attr("x", canvas.center)
        .attr("y", canvas.width);

    if(debug){
        d3.select("rect")
            .attr("width", innerwidth)
            .attr("height", innerwidth);
        d3.select("circle")
            .attr("transform", "translate(" + canvas.center + ", " + canvas.center + ")");
    }
}

resize();

if(debug) {
    svg.classed("debug", true);
    svg.append("rect")
        .attr("width", canvas.width - (canvas.margins * 2))
        .attr("height", canvas.width - (canvas.margins * 2))
        .attr("transform", "translate(" + canvas.margins + ", " + canvas.margins + ")");
    svg.append("circle")
        .attr("r", 5)
        .attr("transform", "translate(" + canvas.center + ", " + canvas.center + ")");
}
