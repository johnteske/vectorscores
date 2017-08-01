---
layout: compress-js
---

var width = 480,
    maxwidth = 480,
    margin = 20,
    boxwidth = width + (margin * 2),
    center = boxwidth * 0.5,
    debug = +VS.getQueryString("debug") === 1 || false;

var noteheads = VS.dictionary.Bravura.durations.stemless;

{% include_relative _rangeGen.js %}
{% include_relative _score.js %}

var main = d3.select(".main")
    .classed("debug", debug)
    .style("width", boxwidth + "px")
    .style("height", boxwidth + "px");

var globjectContainer = main.append("g").attr("class", "globjects");

function update(index) {
    d3.selectAll(".globject").remove();

    globjectContainer.selectAll(".globject")
        .data(score[index])
        .enter()
        .append("g").attr("class", "globject")
        .style("opacity", 1)
        .each(drawGlobject)
        .each(centerGlobject);
}

function centerGlobject(d) {
    d3.select(this).attr("transform", "translate(" +
        (center - (d.width * 0.5)) + "," +
        (center - (120 * 0.5)) + ")");
}


/**
 * Resize
 */
function resize() {
    // update width
    boxwidth = Math.min( parseInt(d3.select("main").style("width"), 10), maxwidth);
    center = boxwidth * 0.5;
    width = boxwidth - (margin * 2);

    main
        .style("width", boxwidth + "px")
        .style("height", boxwidth + "px");

    d3.selectAll(".globject").each(centerGlobject);
}

resize();

d3.select(window).on("resize", resize);

/**
 * Populate score
 */
for (var i = 0; i < score.length; i++) {
    VS.score.add(i * (16000 + VS.getRandExcl(-2000, 2000)), update, [i]);
}

/**
 * Initialize score
 */
update(0);

/**
 * Score controls
 */
VS.control.stopCallback = function() { update(0); };
VS.control.stepCallback = function() { update(VS.score.pointer); };
