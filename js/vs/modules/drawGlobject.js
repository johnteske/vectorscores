---
layout: compress-js
---

var VS = VS || {};

VS.globject = function(d, i) {
    var selection = d3.select(this),
        width = d.width,
        globLeft = 5;

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

    selection.append("g")
        .attr("class", "globject-content")
        .attr("clip-path", "url(#globject-clip-" + i + ")");

    selection.append("path")
         .attr("transform", "translate(" + globLeft + "," + 0 + ")")
         .attr("class", "globject-path")
         .attr("d", lineFunction(rangeLine));
};
