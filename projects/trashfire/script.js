---
---
{% include_relative _dumpster.js %}
{% include_relative _trash.js %}

crumple = Trash(8);

crumple.selection = dumpster.trash.append("circle")
    .attr("cx", 60)
    .attr("cy", 60)
    .attr("r", crumple.size);

crumple.selection
    .transition()
    .duration(1500)
    .attr("cy", -60);
