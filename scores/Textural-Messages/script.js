---
---
var width = 480,
    height = width,
    txtWidth = width * 0.3, // remain fixed
    txtHeight = 180, // 220px from inspector
    margin = 12,
    transDur = 600,
    maxwidth = 480;

var main = d3.select(".main")
    .attr("width", width)
    .attr("height", height);

var txtWrapper = main.append("g") // for easy scrolling
    .attr("width", width)
    .attr("height", height);

{% include_relative _score.js %}
{% comment %}{% include_relative _settings.js %}{% endcomment %}

var noteheads = VS.dictionary.Bravura.durations.stemless;

var ypointer = 0; // latest y position (not score index)
var lastPosition; // latest msg position

function fadeMsgs() {
    d3.selectAll(".wrapper")
        .transition().duration(9000)
        .style("opacity", 0.25);
}

function texturalMsg(position) {
    var relPos = position === "left" ? 0 : 1;

    if (relPos === lastPosition) {
        ypointer += txtHeight * 0.5;
    }

    fadeMsgs();

    // TODO remove need for g.wrapper
    var newTxt = txtWrapper.append("g").attr("class", "wrapper")
        .selectAll(".globject")
        .data([makeGlobject()])
        .enter()
        .append("g")
        .attr("class", "globject")
        .style("opacity", 0) // fade
        .attr("transform", function() {
            // calc on maxwidth, is scaled later
            var x = relPos === 0 ? margin : (maxwidth - txtWidth - margin),
                y = ypointer + margin;
            return "translate(" + x + ", " + y + ")";
        })
        .each(drawGlobject);

    newTxt.selectAll(".globstuff")
        .insert("rect", ":first-child")
            .attr("fill", function(d) { return d.phraseTexture.length > 1 ? "#eee" : "#111"; })
            .attr("x", -20)
            .attr("width", 120 + 40)
            .attr("height", 127);

    newTxt.transition().duration(600)
        .style("opacity", 1); // fade

    ypointer += txtHeight * 0.5;
    lastPosition = relPos;

    scrollWrapper(transDur);
}

function scrollWrapper(dur) {
    var scale = (width / maxwidth);
    if ((ypointer + margin) > (height - margin)) {
        txtWrapper
            .transition()
            .attr("transform", function() {
                var x = 0,
                    y = height - ypointer - txtHeight;
                return "scale(" + scale + "," + scale + ")" +
                    "translate(" + x + ", " + y + ")";
            })
            .duration(dur);
    } else {
        txtWrapper.attr("transform", "scale(" + scale + "," + scale + ")" );
    }
}


/**
 * Resize
 */
function resize() {
    width = Math.min(parseInt(d3.select("main").style("width"), 10), maxwidth);
    height = parseInt(d3.select("main").style("height"), 10);

    main
        .style("width", width + "px")
        .style("height", height + "px");
    scrollWrapper(0);
}

resize();

d3.select(window).on("resize", resize);


/**
 * Populate score
 */
(function() {
    var lastPos = ""; // TODO make these calculations in score

    for(var i = 0; i < 12; i++) {
        lastPos = VS.getWeightedItem([lastPos, lastPos === "left" ? "right" : "left"], [0.2, 0.8]);
        VS.score.add(
            (i * 9000) + (3000 * Math.random()),
            texturalMsg,
            [lastPos]
        );
    }
})();

var scoreLen = VS.score.events[VS.score.events.length - 1][0];
VS.score.add(scoreLen, fadeMsgs);
VS.score.add(scoreLen + 9000, VS.noop);

VS.score.preroll = 1000;
