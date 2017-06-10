/**
 * Draw front and back groups so objects can emerge between the layers
 */
TrashFire.dumpster = (function(TF) {

    var group = TF.world.append("g")
        .classed("dumpster", 1)
        .attr("transform", "translate(180, 150)");

    var back = group.append("g")
        .classed("back", 1)
        .attr("transform", "translate(-92, 0)");
    back.append("use").attr("xlink:href", "dumpster.svg#back");

    var trash = group.append("g");

    var front = group.append("g")
        .classed("front", 1)
        .attr("transform", "translate(-92, 0)");
    front.append("use").attr("xlink:href", "dumpster.svg#front");

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
