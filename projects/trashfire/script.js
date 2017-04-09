---
---

var TrashFire = {
    world: d3.select(".main").attr("width", 480).attr("height", 480)
};

{% include_relative _dumpster.js %}
{% include_relative _trash.js %}
{% include_relative _bins.js %}
{% include_relative _spike.js %}
{% include_relative _score.js %}

var crumple = TrashFire.Trash(60, 60);
crumple.group.append("circle")
    .attr("cx", crumple.center.x)
    .attr("cy", crumple.center.y)
    .attr("r", 8);

var crumple2 = TrashFire.Trash(60, 60);
crumple2.group.append("circle")
    .attr("cx", crumple2.center.x)
    .attr("cy", crumple2.center.y)
    .attr("r", 8);

var crumple3 = TrashFire.Trash(60, 60);
crumple3.group.append("circle")
    .attr("cx", crumple3.center.x)
    .attr("cy", crumple3.center.y)
    .attr("r", 8);

var spike = TrashFire.Spike();

// manual test score
VS.score.add(0, crumple.addToBins);
VS.score.add(2000, TrashFire.bins.add, [crumple2]);
VS.score.add(4000, TrashFire.bins.add, [crumple3]);
VS.score.add(6000, TrashFire.bins.remove, [0]);
VS.score.add(8000, TrashFire.bins.remove, [1]);
VS.score.add(10000, TrashFire.bins.remove, [0]);
VS.score.add(10000, spike.appear);
VS.score.add(15123, spike.hit);
