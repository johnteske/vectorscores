var trash = [3, 5, 7, 9].map(function(size) {
    return {
        size: size,
        active: false
    };
});

function makeCircle(selection) {
    selection.append("circle")
        .attr("cx", TrashFire.trashOrigin.x)
        .attr("cy", TrashFire.trashOrigin.y)
        .attr("r", function(d) { return d.size; });
}

trashContainer.selectAll(".trash")
    .data(trash)
    .enter()
    .append("g")
    .attr("class", "trash")
        .call(makeCircle);

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
