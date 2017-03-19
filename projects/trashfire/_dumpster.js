/**
 * Draw front and back groups so objects can emerge between the layers
 */
 var dumpster = (function() {
    var group = worldSVG.append("g")
        .classed("dumpster", 1)
        .attr("transform", "translate(180, 180)");
    var back = group.append("g");
    var trash = group.append("g");
    var front = group.append("g");

    return {
        group: group,
        back: back,
        trash: trash,
        front: front
    };
})();

dumpster.back
    .classed("back", 1)
    .attr("transform", "translate(10, -10)")
.append("rect")
    .attr("width", 120)
    .attr("height", 120);
dumpster.back.append("path")
    .attr("d", "M0,0 L-20,20 L-20,140 L0,120");

dumpster.front
    .classed("front", 1)
    .attr("transform", "translate(-10, 10)")
.append("rect")
    .attr("width", 120)
    .attr("height", 120);
dumpster.front.append("path")
    .attr("d", "M120,120 L140,100 L140,-20 L120,0");
