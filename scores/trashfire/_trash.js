/**
 * Generate test trash
 */
var trash = [30, 45, 70, 85].map(function(size) {
    return {
        size: size,
        active: true
    };
});

function makeCircle(selection) {
    selection.append("circle")
        .attr("fill-opacity", "0.5")
        .attr("cx", function(d) { return d.size * 0.5; }) // .attr("cx", TrashFire.trashOrigin.x)
        .attr("cy", function(d) { return d.size * 0.5; }) // .attr("cy", TrashFire.trashOrigin.y)
        .attr("r", function(d) { return d.size * 0.5 - 5; });
}

var trashes = trashContainer.selectAll(".trash")
    .data(trash).enter()
    .append("g").attr("class", "trash")
        .attr("transform", function (d, i) {
            return "translate(" + i * 90 + "," + (d.size * -0.5) + ")";
        });
trashes.append("path")
    .style("opacity", function(d) { return d.active ? 1 : 0; })
    .attr("stroke", "grey")
    .attr("fill", "none")
    .attr("d", function(d) {
        var w = 5, h = d.size;
        return "M" + w + ",0 L0,0 L0," + h + " L" + w + "," + h + " " +
            "M" + (h - w) + "," + h + "L" + h + "," + h + " L" + h + "," + 0 + " L" + (h - w) + "," + 0;
    });
trashes.call(makeCircle);

// TrashFire.Trash = function(width, height) {
//     var trash = {},
//         dumpster = TrashFire.dumpster;
//
//     trash.group = dumpster.trash.append("g")
//         .attr("transform", "translate(" + dumpster.center.x + ","  + dumpster.center.y + ")");
//
//     trash.width = width;
//     trash.height = height;
//     trash.center = {
//         x: width * 0.5,
//         y: height * 0.5
//     };
//
//     // TODO methods to add/remove from bins -- as prototype?
//     trash.addToBins = function() {
//         TrashFire.bins.add(trash);
//     };
//
//     trash.makeCircle = function() {
//         trash.group.append("circle")
//             .attr("cx", trash.center.x)
//             .attr("cy", trash.center.y)
//             .attr("r", 8);
//     };
//
//     return trash;
// };
