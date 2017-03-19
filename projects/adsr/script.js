---
# // adapted from original SuperCollider code
---
/**
 * TODO
 * score.width can be 8000 but svg width does not need to be
 * display pitch and timbre inline--and only if there is a change (or make that optional)
 * bounding boxes for phrases? make optional setting?
 * dynamics
 * articulation
 * rehearsal letters
 * show bar lengths (times above barlines)?
 * show second ticks?
 * tie, ghost notes
 * x notehead
 * bartok pizz symbol
 * double bar
 * error-check if score height exceeds view
 * current bar indicator (not debug line)--similar to storyboard indicator?
 * also use flashing indicator when the piece is starting, to time the snap pizz
 */
var score = (function() {
        var width = 8000;
        var svg = d3.select(".main")
            .attr("width", width);
        var group = svg.append("g");
        var layout = group.append("g")
            .classed("layout", 1); // to contain barlines, etc.

        return {
            width: width,
            svg: svg,
            group: group,
            layout: layout
        };
    })();

var unit = 10,
    // calculated in resize()
    view = {
        width: 0,
        height: 0,
        center: 0
    },
    // TODO allow numParts to be set from settings
    numParts = +VS.getQueryString("parts") || 4,
    debug = false;

// symbol dictionary
{% include_relative _symbols.js %}

// generate score
{% include_relative _score.js %}

function getBarlineX(bar) {
    return (score.width * bar) / score.totalDuration;
}
function decimalRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

// create barlines
score.layout.selectAll("line")
    .data(score.bars)
    .enter()
    .append("line")
        .attr("x1", 0)
        .attr("y1", 3 * unit)
        .attr("x2", 0)
        .attr("y2", (numParts * 12 * unit) + (6 * unit))
    .attr("transform", function(d) {
        return "translate(" + getBarlineX(d) + ", " + 0 + ")";
    });

score.layout.selectAll("text")
    .data(score.bars)
    .enter()
    .append("text")
        .text(function(d) { return decimalRound(d, 1) + "\u2033"; }) // &Prime;
        // .text(function(d) { return Math.round(getBarlineX(d)) + "px"; }) // pixel position
    .attr("transform", function(d) {
        return "translate(" + getBarlineX(d) + ", " + 0 + ")";
    });

for (p = 0; p < numParts; p++) {
    var thisPart = parts[p];
    var partGroup = score.group.append("g"); // part group
    var partYPos = (p + 1) * 12 * unit;

    // for each phrase, create a group around a barline
    partGroup.selectAll("g")
        .data(score.bars)
        .enter()
        .append("g")
        .attr("transform", function(d, i) {
            var timeDispersion = part[i].timeDispersion,
                x = getBarlineX(d) + (VS.getItem([-1, 1]) * timeDispersion * unit), // TODO +/- timeDispersion
                y = partYPos;
            return "translate(" + x + ", " + y + ")";
        })
        // add phrase content
        .each(function(d, i) {
            var durations = thisPart[i].durations;
            d3.select(this).append("text")
                .text(function() {
                    var lo = thisPart[i].pitch.low,
                        hi = thisPart[i].pitch.high;
                    return "\uec82 " + pitchDict[lo] + ( (lo !== hi) ? (" – " + pitchDict[hi]) : "" ) + " \uec83";
                })
                .classed("pitch-range", true)
                .attr("y", -3 * unit);
            d3.select(this).append("text")
                .text(thisPart[i].timbre)
                .classed("timbre", true)
                .attr("y", -5 * unit);
            d3.select(this).selectAll("rect") // TODO should selectAll text, although that is broken
                .data(durations)
                .enter()
                .append("text")
                    .text(function(d) { return durDict[d]; })
                    .classed("durations", true)
                    // TODO Make phrase spacing a named function, can be re-used.
                    // Since "durations" us not accessible here, find a way to pass that value
                    .attr("x", function(d, i) {
                        var upToI = durations.slice(0, i),
                            sum = upToI.reduce(function(a, b) {
                                return a + b + 1; // add padding between here
                            }, 0);
                        return sum * unit;
                    });
                // save this, could be an interesting setting to toggle
                // .append("rect")
                //     .attr("x", function(d, i) {
                //         var upToI = durations.slice(0, i),
                //             sum = upToI.reduce(function(a, b) {
                //             return a + b + 1; // add padding between here
                //         }, 0);
                //
                //         return sum * unit;
                //     })
                //     .attr("y", function(d, i) { return 0; })
                //     .attr("width", function(d) { return d * unit; })
                //     .attr("height", unit)
        });
}

function scrollScore(ndex, params) {
    var dur = params[0];
    var targetIndex = params[1] ? ndex + 1 : ndex; // true = proceed to next bar, false = go to this bar
    var targetBar = score.bars[targetIndex];
    var scoreGroupHeight = score.group.node().getBBox().height * 0.5;

    score.group
        .transition()
        .duration(dur)
        .ease("linear")
        .attr("transform", function() {
            // TODO calculate score vertical center positions on resize and store--don't calc on every scroll
            return "translate(" +
                (view.center - getBarlineX(targetBar)) + "," +
                ((view.height * 0.5) - scoreGroupHeight) +
                ")";
        });
}

/**
 * Populate score
 * Use a preroll so the score doesn't start scrolling immediately // TODO allow user to define this value
 */
// VS.score.preroll = 600;

for(i = 0; i < score.bars.length; i++) {
    var duration = score.bars[i + 1] - score.bars[i];
    VS.score.add([ score.bars[i] * 1000, scrollScore, [duration * 1000, true] ]); // time, func, [duration, go to next bar]
}

VS.score.pauseCallback = function(){ scrollScore(VS.score.pointer, [300]); };
VS.score.stopCallback = function(){ scrollScore(0, [300]); };
VS.score.stepCallback = function(){ scrollScore(VS.score.pointer, [300]); };

{% include_relative _debug.js %}

function resize() {
    view.width = parseInt(d3.select("main").style("width"), 10);
    view.center = view.width * 0.5;
    view.height = parseInt(d3.select("main").style("height"), 10);

    score.svg.attr("height", view.height);

    if(debug){ resizeDebug(); }

    scrollScore(VS.score.pointer, [0]);
}

resize();

d3.select(window).on("resize", resize);
