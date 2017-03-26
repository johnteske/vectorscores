TrashFire.Trash = function(width, height) {
    var trash = {},
        dumpster = TrashFire.dumpster;

    trash.group = dumpster.trash.append("g")
        // TODO create at dumpster center
        .attr("transform", "translate(" + dumpster.center.x + ","  + dumpster.center.y + ")");

    trash.width = width;
    trash.height = height;
    trash.center = {
        x: width * 0.5,
        y: height * 0.5
    };

    // TODO methods to add/remove from bins

    return trash;
};
