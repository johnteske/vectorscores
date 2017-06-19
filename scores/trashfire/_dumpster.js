/**
 * Draw front and back groups so objects can emerge between the layers
 */

// dumpster width = 312
TrashFire.trashOrigin = {
    x: 312 * 0.5,
    y: 204 * 0.5
};

var dumpster = TrashFire.svg.append("g")
    .attr("class", "dumpster")
    .attr("transform", function() {
        var x = (TrashFire.view.width - 312) * 0.5;
        return "translate(" + x + ", " + TrashFire.dumpster.y + ")";
    });

dumpster.append("g")
    .classed("back", 1)
    .append("use").attr("xlink:href", "dumpster.svg#back");

var trashContainer = dumpster.append("g");

dumpster.append("g")
    .classed("front", 1)
    .append("use").attr("xlink:href", "dumpster.svg#front");

function dumpsterShake() {
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
