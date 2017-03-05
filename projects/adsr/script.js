---
# // adapted from original SuperCollider code
---

var scoreWidth = 8000,
    height = 640,
    unit = 10,
    timePoints = [ 0, 6.3858708756625, 10.33255612459, 16.718427000252, 27.050983124842, 37.383539249432, 43.769410125095, 47.716095374022, 50.155281000757, 54.101966249685, 60.487837125347, 66.873708001009, 70.820393249937, 77.206264125599, 81.152949374527, 87.538820250189, 97.871376374779, 108.20393249937, 114.58980337503, 124.92235949962, 131.30823037528, 141.64078649987, 158.35921350013, 175.07764050038, 185.41019662497, 195.74275274956, 212.46117974981, 229.17960675006, 239.51216287465, 245.89803375032, 256.23058987491, 262.61646075057, 272.94901687516, 283.28157299975, 289.66744387541, 293.61412912434, 300 ],
    scoreLength = timePoints[timePoints.length - 1],
    // for interpolating parameter envelopes, scaled to 1. originally in SuperCollider as durations, not points in time
    structurePoints = [0, 0.14586594177599999, 0.236029032, 0.381924, 0.618, 0.763970968, 1 ],
    // calculated in resize()
    viewWidth = 0,
    viewCenter = 0,
    // TODO allow numParts to be set from settings
    numParts = +VS.getQueryString("parts") || 4,
    debug = false;

// symbol dictionary
{% include_relative _symbols.js %}

// generate score
{% include_relative _score.js %}

var main = d3.select(".main")
    .attr("height", height)
    .attr("width", scoreWidth);

var scoreGroup = main.append("g");

// create placeholder barlines

var layoutGroup = scoreGroup.append("g");

layoutGroup.selectAll("line")
    .data(timePoints)
    .enter()
    .append("line")
        .attr("x1", 0)
        .attr("y1", 6 * unit)
        .attr("x2", 0)
        .attr("y2", height - (6 * unit))
    .style("stroke", "black")
    .style("stroke-opacity", "0.25")
    .attr("transform", function(d) {
        var x = (scoreWidth * d) / scoreLength,
            y = 0;
        return "translate(" + x + ", " + y + ")";
    });

for (p = 0; p < numParts; p++) {
    var thisPart = parts[p];
    var partGroup = scoreGroup.append("g"); // part group
    var partYPos = (p + 1) * 12 * unit;

    // for each phrase, create a group around a timePoint
    partGroup.selectAll("g")
        .data(timePoints)
        .enter()
        .append("g")
        .attr("transform", function(d, i) {
            var timeDispersion = part[i].timeDispersion,
                x = ((scoreWidth * d) / scoreLength) + (VS.getItem([-1, 1]) * timeDispersion * unit), // TODO +/- timeDispersion
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

function scrollScore(ndex, dur) {
    var thisPoint = timePoints[ndex];
    scoreGroup
    .transition()
    .duration(dur)
    .attr("transform", function() {
        return "translate(" + (viewCenter + (-scoreWidth * thisPoint) / scoreLength) + "," + 0 + ")";
    });
}
for(i = 0; i < timePoints.length; i++) {
    VS.score.add([timePoints[i] * 1000, scrollScore, (timePoints[i + 1] - timePoints[i]) * 1000]); // time, func, duration
}
VS.score.stopCallback = function(){ scrollScore(0, 300); };
VS.score.stepCallback = function(){ scrollScore(VS.score.pointer, 300); };

//
{% include_relative _debug.js %}
//

function resize() {
    viewWidth = parseInt(d3.select("main").style("width"), 10);
    viewCenter = viewWidth * 0.5;

    if(debug){ resizeDebug(viewWidth, viewCenter); }

    scrollScore(VS.score.pointer, 0);
}

resize();

d3.select(window).on("resize", resize);
