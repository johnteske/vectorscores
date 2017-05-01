function cueTriangle(parent) {
    var cue = {};
    var onTime = 25,
        fadeTime = 725;

    cue.selection = parent.append("path")
        .attr("class", "indicator")
        .attr("d", "M0,0 L6,2 12,0 6,12 0,0")
        .style("stroke", "black")
        .style("stroke-width", "1")
        .style("fill", "none");

    cue.blink = function() {
        cue.selection
            .transition().duration(onTime)
            .style("opacity", "1")
            .transition().delay(onTime).duration(fadeTime)
            .style("opacity", "0")

            .transition().delay(1000).duration(onTime)
            .style("opacity", "1")
            .transition().delay(1000 + onTime).duration(fadeTime)
            .style("opacity", "0")

            .transition().delay(2000).duration(onTime)
            .style("opacity", "1")
            .transition().delay(2000 + onTime).duration(fadeTime)
            .style("opacity", "0");
    };

    return cue;
}
