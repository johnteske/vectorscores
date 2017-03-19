---
---

var worldSVG = d3.select(".main")
    .attr("width", 480)
    .attr("height", 480);

{% include_relative _dumpster.js %}
{% include_relative _trash.js %}

var crumple = Trash(8);

crumple.selection = dumpster.trash.append("circle")
    .attr("cx", 60)
    .attr("cy", 60)
    .attr("r", crumple.size);

function moveCrumple(i, params) {
    var dur = params[0];
    var y = params[1];
    crumple.selection
        .transition()
        .duration(dur)
        .attr("cy", y);
}

VS.score.add([0, moveCrumple, [1500, -60]]);
VS.score.add([1500, moveCrumple, [1500, 60]]);
