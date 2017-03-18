/**
 * Draw front and back groups so objects can emerge between the layers
 */
 var dumpster = (function() {
    var container = d3.select(".main")
        .attr("width", 480)
        .attr("height", 480);
    var group = container.append("g")
        .attr("transform", "translate(180, 180)");

    return {
        container: container,
        group: group
    };
})();

dumpster.back = dumpster.group.append("g")
    .classed("back", 1)
    .attr("transform", "translate(10, -10)");
dumpster.back.append("rect")
    .attr("width", 120)
    .attr("height", 120);
dumpster.back.append("path")
    .attr("d", "M0,0 L-20,20 L-20,140 L0,120");

dumpster.front = dumpster.group.append("g")
    .classed("front", 1)
    .attr("transform", "translate(-10, 10)");
dumpster.front.append("rect")
    .attr("width", 120)
    .attr("height", 120);
dumpster.front.append("path")
    .attr("d", "M120,120 L140,100 L140,-20 L120,0");
