---
layout: compress-js
---
/**
 * TODO refactor as module (not as a generator but with prototype space)
 */
VS.cueTriangle = function(parent) {
    var cue = {};
    var onTime = 50,
        fadeTime = 700;

    cue.selection = parent.append("path")
        .attr("class", "indicator")
        .attr("d", "M-6.928,0 L0,2 6.928,0 0,12 Z")
        .style("stroke", "black")
        .style("stroke-width", "1")
        .style("fill", "black")
        .style("fill-opacity", "0");

    // TODO allow custom options: opacities, timing, blink fn (other than fill-opacity?), etc.
    cue.blink = function(onOpacity, offOpacity, endOpacity, times) {
        var on = onOpacity || 1;
            off = offOpacity || 0,
            end = endOpacity || 0,
            n = times || 3;

        function blinkCycle(selection, delay, isEnd) {
            selection.transition().delay(delay).duration(onTime)
                .style("fill-opacity", on)
                .transition().delay(onTime).duration(fadeTime)
                .style("fill-opacity", isEnd ? end : off);
        }

        for (var i = 0; i < (n + 1); i++) {
            cue.selection.call(blinkCycle, i * 1000, i === n)
        }
    };

    // TODO assuming 0 offOpacity until refactored
    cue.cancel = function() {
        cue.selection
            .transition()
            .style("fill-opacity", 0);
    }

    return cue;
};
