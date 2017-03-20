---
---

var worldSVG = d3.select(".main")
    .attr("width", 480)
    .attr("height", 480);

{% include_relative _dumpster.js %}
{% include_relative _trash.js %}
{% include_relative _bins.js %}

var crumple = Trash(8);

crumple.selection = dumpster.trash.append("circle")
    .attr("cx", 60)
    .attr("cy", 60)
    .attr("r", crumple.size);

// NOTE currently score events are called with the event index as the first argument
// I'm reluctant to keep this as it means every function that can be called needs
// to accept this--which does not seem intuitive or flexbile
//
// VS.score.add([0, bins.add, crumple.selection]);
// VS.score.add([4000, bins.remove, crumple.selection]);

window.setTimeout(function() {
    bins.add(crumple.selection);
}, 1000);
window.setTimeout(function() {
    bins.remove(0);
}, 4000);
