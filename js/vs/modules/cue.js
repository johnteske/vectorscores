---
layout: compress-js
---
VS.cueTriangle = function(parent) {
    var cue = {};
    var onTime = 50,
        fadeTime = 700;

    cue.selection = parent.append("path")
        .attr("class", "indicator")
        .attr("d", "M0,0 L6,2 12,0 6,12 0,0")
        .style("stroke", "black")
        .style("stroke-width", "1")
        .style("fill", "black")
        .style("fill-opacity", "0");

    // TODO allow custom options: opacities, timing, blink fn (other than fill-opacity?), etc.
    cue.blink = function(onOpacity, offOpacity, endOpacity) {
        function blinkFn(opacity) {
            return function(selection) { selection.style("fill-opacity", opacity); };
        }

        var blinkOn = blinkFn(onOpacity || 1),
            blinkOff = blinkFn(offOpacity || 0),
            blinkEnd = blinkFn(endOpacity || 0);

        function blinkCycle(selection, delay, end) {
            selection.transition().delay(delay).duration(onTime)
                .call(blinkOn)
                .transition().delay(onTime).duration(fadeTime)
                .call(end ? blinkEnd : blinkOff);
        }

        cue.selection
            .call(blinkCycle, 0)
            .call(blinkCycle, 1000)
            .call(blinkCycle, 2000)
            .call(blinkCycle, 3000, true);
    };

    return cue;
};
