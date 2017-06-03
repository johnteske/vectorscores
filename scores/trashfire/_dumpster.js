/**
 * Draw front and back groups so objects can emerge between the layers
 */
TrashFire.dumpster = (function(TF) {

    var group = TF.world.append("g")
        .classed("dumpster", 1)
        .attr("transform", "translate(180, 180)");

    var back = group.append("g")
        .classed("back", 1)
        .attr("transform", "translate(10, -10)");
    back.append("rect")
        .attr("width", 120)
        .attr("height", 120);
    back.append("path")
        .attr("d", "M0,0 L-20,20 L-20,140 L0,120");

    var trash = group.append("g");

    var front = group.append("g")
        .classed("front", 1)
        .attr("transform", "translate(-10, 10)");
    front.append("rect")
        .attr("width", 120)
        .attr("height", 120);
    front.append("path")
        .attr("d", "M120,120 L140,100 L140,-20 L120,0");

    var center = {
        x: 30,
        y: 30
    };

    return {
        group: group,
        back: back,
        trash: trash,
        front: front,
        center: center
    };

})(TrashFire);
