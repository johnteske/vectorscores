---
layout: compress-js
---

var width = 480,
    maxwidth = 480,
    margin = 20,
    boxwidth = width + (margin * 2),
    center = boxwidth * 0.5,
    debug = +VS.getQueryString("debug") === 1 || false,
    layout = {
        perc: {
            x: center - 90 - 22,
            y1: center + 90,
            y2: center + 150
        },
    };

{% include_relative _rhythms.js %}

{% include_relative _score.js %}

var main = d3.select(".main")
    .classed("debug", debug)
    .style("width", boxwidth + "px")
    .style("height", boxwidth + "px");

var globjectContainer = main.append("g").attr("class", "globjects");

/**
 * Rhythm test
 */
var percussionParts = main.append("g")
    .attr("class", "percussion-parts");

var perc1 = percussionParts.append("g")
    .attr("transform", "translate(" + layout.perc.x + "," + layout.perc.y1 + ")");

var perc2 = percussionParts.append("g")
    .attr("transform", "translate(" + layout.perc.x + "," + layout.perc.y2 + ")");

percussionParts.selectAll("g").call(function(selection) {
    selection.append("text")
        .style("font-family", "Bravura")
        .attr("y", 22)
        .text("\ue069");

    var rhythmCell = selection.append("g")
        .attr("transform", "translate(" + 22 + "," + 0 + ")")
        .attr("class", "rhythm");

    rhythmCell.append("rect")
        .attr("height", 45)
        .attr("stroke", "#888")
        .attr("fill", "none");

    rhythmCell.append("text")
        .attr("dx", 11)
        .attr("y", 30);

    var rhythmCell2 = selection.append("g")
        .attr("transform", "translate(" + 22 + "," + 0 + ")")
        .attr("class", "rhythm");

    rhythmCell2.append("rect")
        .attr("height", 45)
        .attr("stroke", "#888")
        .attr("fill", "none");

    rhythmCell2.append("text")
        .attr("dx", 11)
        .attr("y", 30);
});

/**
 *
 */
function update(index) {
    var h = 90;

    d3.selectAll(".globject").remove();

    var globject = VS.globject()
        .width(function(d) { return d.width; })
        .height(h);

    globjectContainer.selectAll(".globject")
        .data(score[index])
        .enter()
        .append("g")
        .each(globject)
        .each(centerGlobject);

    function createRhythm() {
        var selection = d3.select(this),
            textEl = selection.select("text");

        textEl.selectAll("tspan").remove();

        var randRhythm = VS.getItem(rhythms.filter(function(r) {
            return r !== percRhythm; // prevent duplicates within each part
        }));

        percRhythm = randRhythm;

        var symbols = randRhythm.split(",");

        for (var i = 0; i < symbols.length; i++) {
            var symbol = symbols[i],
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

        selection.attr("transform", "translate(" + (22 + xOffset)+ "," + 0 + ")");
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
    VS.score.add(i * 1000, update, [i]);
}

/**
 * Initialize score
 */
d3.select(window).on("load", function () {
    update(0);
});

/**
 * Score controls
 */
VS.control.stopCallback = function() { update(0); };
VS.control.stepCallback = function() { update(VS.score.pointer); };
