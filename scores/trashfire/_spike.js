function makeSpike() {
    d3.selectAll(".spike").remove();

    var spike = TrashFire.svg.append("g")
        .attr("class", "spike")
        .attr("transform", "translate(" + ((TrashFire.view.width - 30) * 0.5) + ","  + 15 + ")");
    spike.append("path")
        .attr("d", "M0,0 L30,0 L15,60 L0,0");
    spike
        .style("opacity", 0)
        .transition().duration(1000)
        .style("opacity", 1);
}

function hitSpike() {
    trash = [];
    updateTrash(300);

    d3.select(".spike")
        .transition()
        .duration(600)
        .ease("elastic")
        .attr("transform", "translate(" + ((TrashFire.view.width - 30) * 0.5) + ","  + (TrashFire.dumpster.y - 45) + ")")
        .transition()
        .duration(300)
        .ease("linear")
        .style("opacity", 0)
        .remove();

    dumpster
        .transition()
        .duration(300)
        .ease("elastic")
        .attr("transform", function() {
            var x = (TrashFire.view.width - 312) * 0.5;
            return "translate(" + x + ", " + (TrashFire.dumpster.y + 10) + ")";
        })
        .transition()
        .duration(300)
        .ease("bounce")
        .attr("transform", function() {
            var x = (TrashFire.view.width - 312) * 0.5;
            return "translate(" + x + ", " + TrashFire.dumpster.y + ")";
        });
}
