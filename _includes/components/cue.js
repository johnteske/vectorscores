function cueTriangle(parent) {
    var cue = {};
    var onTime = 50,
        fadeTime = 700;

    cue.selection = parent.append("path")
        .attr("class", "indicator")
        .attr("d", "M0,0 L6,2 12,0 6,12 0,0")
        .style("stroke", "black")
        .style("stroke-width", "1")
        .style("fill", "none");

    // TODO allow custom opacities AND timing
    // opacities: { on:, off:, end: }
    // times: { on:, off: }
    cue.blink = function(onOpacity, offOpacity, endOpacity) {
        onOpacity = onOpacity || 1;
        offOpacity = offOpacity || 0.25;
        endOpacity = endOpacity || 0;
        cue.selection
            .transition().duration(onTime)
            .style("opacity", onOpacity)
            .transition().delay(onTime).duration(fadeTime)
            .style("opacity", offOpacity)

            .transition().delay(1000).duration(onTime)
            .style("opacity", onOpacity)
            .transition().delay(1000 + onTime).duration(fadeTime)
            .style("opacity", offOpacity)

            .transition().delay(2000).duration(onTime)
            .style("opacity", onOpacity)
            .transition().delay(2000 + onTime).duration(fadeTime)
            .style("opacity", offOpacity)

            .transition().delay(3000).duration(onTime)
            .style("opacity", onOpacity)
            .transition().delay(3000 + onTime).duration(fadeTime)
            .style("opacity", endOpacity);
    };

    return cue;
}
