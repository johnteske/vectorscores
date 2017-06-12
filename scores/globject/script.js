---
---
var width = 480,
    maxwidth = 480,
    margin = 20,
    boxwidth = width + (margin * 2),
    center = boxwidth * 0.5,
    globLeft = 5,
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
update(0);

function centerGlobject(d, i) {
    d3.select(this).attr("transform", "translate(" +
        (center - (d.width * 0.5)) + "," +
        (center - (120 * 0.5)) + ")");
}

function drawGlobject(d, i){
    var selection = d3.select(this),
        width = d.width;

    var rangeEnvelope = d.rangeEnvelope,
        hiRangePoints = [],
        loRangePoints = [];

    for (var t = 0; t < rangeEnvelope.times.length; t++) {
        hiRangePoints.push({ "x": rangeEnvelope.times[t], "y": rangeEnvelope.hi[t]});
        loRangePoints.push({ "x": rangeEnvelope.times[t], "y": rangeEnvelope.lo[t]});
    }
    // draw the top, back around the bottom, then connect back to the first point
    var rangeLine = hiRangePoints.concat(loRangePoints.reverse());

    var lineFunction = d3.svg.line()
         .x(function(d) { return d.x * width; })
         .y(function(d) { return 127 - d.y; }) // pitch is bottom-up, not pixel top2bottom
         .tension(0.8)
         .interpolate("cardinal-closed");

    selection.append("clipPath")
        .attr("id", "globject-clip-" + i)
        .append("path")
        .attr("transform", "translate(" + globLeft + "," + 0 + ")")
        .attr("d", lineFunction(rangeLine));

    var content = selection.append("g")
        .attr("class", "globstuff")
        .attr("clip-path", "url(#globject-clip-" + i + ")");

    function phraseSpacing(selection) {
        var durations = d.phraseTexture;
        return VS.xByDuration(selection, durations, 18, 0) + 64;
    }

    for (var i = 0, phrases = 16; i < phrases; i++) {
        content.append("g")
            .attr("transform", function() {
                var y = (127 / phrases) * i;
                return "translate(" + Math.random() * width + "," + y + ")"
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

    selection.append("path")
         .attr("transform", "translate(" + globLeft + "," + 0 + ")")
         .attr("class", "rangePath")
         .attr("d", lineFunction(rangeLine));

    selection.append("g")
        .selectAll("text")
        .data(d.pitches)
        .enter()
        .append("text")
        .attr("x", function(d) {
            return d.time * width;
        })
        .attr("y", 127 + 24)
        .text(function(d) {
            var pcSet = d.classes.map(function(pc) {
                return pcFormat(pc, ""); // scoreSettings.pcFormat
                // return pcFormat(pc, "name"); // scoreSettings.pcFormat
            });
            return "[" + pcSet.join(", ") + "]";
        })

    selection.append("g")
        .selectAll("text")
        .data(d.dynamics)
        .enter()
        .append("text")
        .attr("x", function(d, i) {
            return d.time * width;
        })
        .attr("y", 127 + 42)
        .text(function(d) { return d.value; });
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
    VS.score.add(i * 2000, update, [i]);
}

/**
 * Score controls
 */
VS.control.stopCallback = function() { update(0); }
VS.control.stepCallback = function() { update(VS.score.pointer); }
