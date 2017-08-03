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

    var globject = VS.globject()
        .width(function(d) { return d.width; })
        .height(127);

    globjectContainer.selectAll(".globject")
        .data(score[index])
        .enter()
        .append("g")
        .each(globject)
        .each(centerGlobject);

    globjectContainer.selectAll(".globject-content").each(function(d) {
        var selection = d3.select(this),
            w = d.width;

        function phraseSpacing(selection) {
            var durations = d.phraseTexture;
            return VS.xByDuration(selection, durations, 18, 0) + 64;
        }

        // 127 / ~10px notehead height = 13 y layers
        for (var phrase = 0, phrases = 13; phrase < phrases; phrase++) {
            selection
                .append("g")
                .attr("transform", function() {
                    var halfWidth = w * 0.5,
                        x = Math.random() * halfWidth + (halfWidth * (phrase % 2)),
                        y = (127 / phrases) * phrase;
                    return "translate(" + x + "," + y + ")";
                })
                .selectAll("text")
                .data(d.phraseTexture)
                .enter()
                .append("text")
                .text(function(d) {
                    return noteheads[d];
                })
                .call(phraseSpacing);
        }
    });

    globjectContainer.selectAll(".globject").each(function(d) {
        var selection = d3.select(this),
            w = d.width;

        selection
            .append("g")
            .selectAll("text")
            .data(function(d) { return d.pitches; })
            .enter()
            .append("text")
            .attr("x", function(d) {
                return d.time * w;
            })
            .attr("y", 127 + 24)
            .text(function(d) {
                var pcSet = d.classes.map(function(pc) {
                    return VS.pitchClass.format(pc);
                });
                return "[" + pcSet.join(", ") + "]";
            });

        selection.append("g")
            .selectAll("text")
            .data(d.dynamics)
            .enter()
            .append("text")
            .attr("x", function(d) {
                return d.time * w;
            })
            .attr("y", 127 + 42)
            .text(function(d) { return d.value; });
    });

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
