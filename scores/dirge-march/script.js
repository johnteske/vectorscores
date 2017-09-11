---
layout: compress-js
---

var width = 480,
    height = 480,
    debug = +VS.getQueryString("debug") === 1 || false,
    transposeBy = 2,
    layout = {
        scale: 1,
        margin: {
            left: 0,
            top: 0
        },
        globjects: {
            top: 16
        },
        perc: {
            y: 190,
            y1: 16,
            y2: 60 + 16
        },
    };

// TODO a temporary solution to update rhythms within bars--eventually add specific rhythm selections/option to score
var updateTimeout;
var updateInterval = 8000;

{% include_relative _globjects.js %}
{% include_relative _rhythms.js %}
{% include_relative _score.js %}
{% include_relative _settings.js %}

var wrapper = d3.select("svg")
    .append("g")
    .attr("class", "wrapper")
    .classed("debug", debug);
    // .attr("transform", "translate(" + layout.margin.left + "," + layout.margin.top + ")");

var globjectContainer = wrapper.append("g")
    .attr("class", "globjects")
    .attr("transform", "translate(0," + layout.globjects.top + ")");

var durationText = globjectContainer.append("text")
    .attr("class", "duration-text")
    .attr("dy", -layout.globjects.top);

/**
 * Rhythm test
 */
var percussionParts = wrapper.append("g")
    .attr("transform", "translate(" + 0 + "," + layout.perc.y + ")")
    .attr("class", "percussion-parts");

var tempoText = percussionParts.append("text")
    .attr("class", "tempo-text");

tempoText.append("tspan")
    .text(stemmed["1"]);

var perc1 = percussionParts.append("g")
    .attr("transform", "translate(" + 0 + "," + layout.perc.y1 + ")");

var perc2 = percussionParts.append("g")
    .attr("transform", "translate(" + 0 + "," + layout.perc.y2 + ")");

percussionParts.selectAll("g").call(function(selection) {
    selection.append("text")
        .style("font-family", "Bravura")
        .attr("x", -22)
        .attr("y", 22)
        .text("\ue069");

    function createRhythmCell(g) {
        var cell = g.append("g")
            // .attr("transform", "translate(" + 22 + "," + 0 + ")")
            .attr("class", "rhythm");

        cell.append("rect")
            .attr("height", 45)
            .attr("stroke", "#888")
            .attr("fill", "none");

        cell.append("text")
            .attr("dx", 11)
            .attr("y", 30);
    }

    // create two rhythm cells
    selection.call(createRhythmCell);
    selection.call(createRhythmCell);
});

var globject = VS.globject()
    .width(function(d) { return d.width; })
    .height(90)
    .curve(d3.curveCardinalClosed.tension(0.3));

/**
 *
 */
function update(index, isControlEvent) {
    /**
     * Globjects
     */
    d3.selectAll(".globject").remove();

    globjectContainer.selectAll(".globject")
        .data(score[index].globjects)
        .enter()
        .append("g")
        .each(globject)
        .each(function(d) {
            var selection = d3.select(this);

            var g = selection.append("g").attr("transform", "translate(0, 90)"),
                pitch = score[index].pitch,
                text;

            var anchor = {
                "0": "start",
                "0.5": "middle",
                "1": "end"
            };

            var modifiers = {
                "^": " \ueb61", // up, right
                "-": " \ueb62", // right
                "v": " \ueb63", // down, right
                "<": " \ueb61, \ueb63"
            };

            for (var i = 0; i < pitch.length; i++) {
                text = g.append("text")
                    .attr("dy", "2em")
                    .attr("x", pitch[i].time * d.width)
                    .attr("text-anchor", anchor[pitch[i].time]);

                var set = VS.pitchClass.transpose(pitch[i].classes, transposeBy).map(function(pc) {
                    return VS.pitchClass.format(pc, scoreSettings.pcFormat);
                });
                var formatted = "{" + set + "}";

                text.append("tspan")
                    .attr("class", "pitch-class")
                    .text(formatted);
                text.append("tspan")
                    .attr("class", "modifier")
                    .text(modifiers[pitch[i].modifier]);
            }
        });

    durationText.text(score[index].duration + "\u2033");

    /**
     * Tempo
     */
    var tempo = score[index].tempo;

    tempoText.select(".bpm").remove();

    tempoText.append("tspan")
        .attr("class", "bpm")
        .text(" = " + tempo);

    percussionParts
        // .transition().duration(300) // TODO fade in/out as part of event, not on start of event
        .style("opacity", tempo ? 1 : 0);

    /**
     * Rhythms
     * TODO stash creation functions elsewhere?
     */
    function createRhythm() {
        var selection = d3.select(this),
            textEl = selection.select("text");

        textEl.selectAll("tspan").remove();

        if (!tempo) {
            return;
        }

        var randRhythm = VS.getItem(rhythms.filter(function(r) {
            return r !== percRhythm; // prevent duplicates within each part
        }));

        percRhythm = randRhythm;

        var symbols = randRhythm.split(",");

        for (var si = 0; si < symbols.length; si++) {
            var symbol = symbols[si],
                dy = symbol === "r0.5" || symbol === "r0.5." ? 0.4 : 0;

            textEl.append("tspan")
                .style("baseline-shift", dy + "em")
                .text(stemmed[symbol]);
        }

        var textWidth = textEl.node().getBBox().width;
        // TODO set d.width

        selection.select("rect").attr("width", textWidth + 22);
    }

    function spacePerc(d, i) {
        var selection = d3.select(this);

        var width = selection.node().getBBox().width;
        var xOffset = percPos + (i * 11);
        percPos += width;
        // TODO get d.width

        selection.attr("transform", "translate(" + xOffset + "," + 0 + ")");
    }

    var percPos = 0;
    var percRhythm = "";
    perc1.selectAll(".rhythm")
        .each(createRhythm)
        .each(spacePerc);

    percPos = 0;
    percRhythm = "";
    perc2.selectAll(".rhythm")
        .each(createRhythm)
        .each(spacePerc);

    // TODO
    if (!isControlEvent) {
        updateTimeout = window.setTimeout(function() { update(index); }, updateInterval);
    } else {
        window.clearTimeout(updateTimeout);
    }
}

/**
 * Resize
 */
function resize() {
    var main = d3.select("main");

    var w = parseInt(main.style("width"), 10);
    var h = parseInt(main.style("height"), 10);

    var scaleX = VS.clamp(w / width, 0.25, 2);
    var scaleY = VS.clamp(h / height, 0.25, 2);

    layout.scale = Math.min(scaleX, scaleY);

    layout.margin.left = (w * 0.5) - (120 * layout.scale);
    layout.margin.top = (h * 0.5) - ((height * 0.5 - 72) * layout.scale);

    wrapper.attr("transform", "translate(" + layout.margin.left + "," + layout.margin.top + ") scale(" + layout.scale + "," + layout.scale + ")");
}

d3.select(window).on("resize", resize);

/**
 * Populate score
 */
for (var i = 0; i < score.length; i++) {
    VS.score.add(score[i].time * 1000, update, [i]);
}

/**
 * Initialize score
 */
d3.select(window).on("load", function () {
    resize();
    update(0, true);
});

/**
 * Score controls
 */
VS.control.stopCallback = function() {
    update(0, true);
};
VS.control.pauseCallback = VS.control.stepCallback = function() {
    update(VS.score.pointer, true);
};
