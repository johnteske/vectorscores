---
---

var TrashFire = {
    world: d3.select(".main").attr("width", 480).attr("height", 480)
};

{% include_relative _dumpster.js %}
{% include_relative _trash.js %}
{% include_relative _bins.js %}

var crumple = Trash(60, 60);
crumple.group.append("circle")
    .attr("cx", crumple.center.x)
    .attr("cy", crumple.center.y)
    .attr("r", 8);

var crumple2 = Trash(60, 60);
crumple2.group.append("circle")
    .attr("cx", crumple2.center.x)
    .attr("cy", crumple2.center.y)
    .attr("r", 8);

var crumple3 = Trash(60, 60);
crumple3.group.append("circle")
    .attr("cx", crumple3.center.x)
    .attr("cy", crumple3.center.y)
    .attr("r", 8);

// NOTE currently score events are called with the event index as the first argument
// I'm reluctant to keep this as it means every function that can be called needs
// to accept this--which does not seem intuitive or flexbile
//
// VS.score.add([0, bins.add, crumple.selection]);
// VS.score.add([4000, bins.remove, crumple.selection]);

window.setTimeout(function() {
    TrashFire.bins.add(crumple);
}, 0);
window.setTimeout(function() {
    TrashFire.bins.add(crumple2);
}, 2000);
window.setTimeout(function() {
    TrashFire.bins.add(crumple3);
}, 4000);
window.setTimeout(function() {
    TrashFire.bins.remove(0);
}, 6000);
window.setTimeout(function() {
    TrashFire.bins.remove(1);
}, 8000);
