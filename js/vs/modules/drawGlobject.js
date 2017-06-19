/**
 * NOTE/TODO dependencies: [dictionary.bravura, xByDuration, pitchClassFormat]
 * TODO rather than class (removed) or static function (present), perhaps this module is meant as a globject generator, like d3.svg.line()
 */
function drawGlobject(d, i){
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

    var content = selection.append("g")
        .attr("class", "globstuff")
        .attr("clip-path", "url(#globject-clip-" + i + ")");

    function phraseSpacing(selection) {
        var durations = d.phraseTexture;
        return VS.xByDuration(selection, durations, 18, 0) + 64;
    }

    // 127 / ~10px notehead height = 13 y layers
    for (var i = 0, phrases = 13; i < phrases; i++) {
        content.append("g")
            .attr("transform", function() {
                var halfWidth = width * 0.5,
                    // x = Math.random() * width,
                    x = Math.random() * halfWidth + (halfWidth * (i % 2)),
                    y = (127 / phrases) * i;
                return "translate(" + x + "," + y + ")"
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
                // return pcFormat(pc, ""); // scoreSettings.pcFormat
                return pcFormat(pc, "name"); // scoreSettings.pcFormat
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
