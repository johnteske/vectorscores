TrashFire.Spike = function() {
    var spike = {},
        dumpster = TrashFire.dumpster,
        center = (180 + dumpster.center.x + 15);

    spike.group = TrashFire.world.append("g")
        .attr("transform", "translate(" + center + ","  + 15 + ")")
        .style("opacity", 0);

    spike.group.append("path")
        .attr("d", "M0,0 L30,0 L15,60 L0,0");

    spike.appear = function() {
        spike.group
            .style("opacity", 0)
            .transition()
            .duration(3000)
            .style("opacity", 1);
    };

    spike.hit = function() {
        spike.group
            .transition()
            .duration(600)
            .ease("elastic")
            .attr("transform", "translate(" + center + ","  + 105 + ")");

    // TODO shake dumpster?
    // var dumpsterPosition = dumpster.group.node().getBBox();
    dumpster.group
        .transition()
        // .delay(600)
        .duration(300)
        .ease("elastic")
        .attr("transform", "translate(" + (180) + "," + (150 + 10) + ")")
        .transition()
        .duration(300)
        .ease("bounce")
        .attr("transform", "translate(" + (180) + "," + (150) + ")");
};

    return spike;
};
