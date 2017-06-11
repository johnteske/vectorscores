/**
 * Generate test trash
 */
var trash = [];

function makeCircle(selection) {
    selection.append("circle")
        .attr("fill-opacity", "0.5")
        .attr("cx", function(d) { return d.size * 0.5; })
        .attr("cy", function(d) { return d.size * 0.5; })
        .attr("r", function(d) { return d.size * 0.5 - 5; });
}

function updateTrash() {
    var offset = 10;
    var trashWidths = trash.map(function(t) {
        return t.size;
    });
    var trashWidthSum = trashWidths.reduce(function(a, b) {
        return a + b;
    }, (trashWidths.length - 1) * offset);

    function trashPosition (d, i) {
        var upToI = trashWidths.slice(0, i),
            sum = upToI.reduce(function(a, b) {
                return a + b;
            }, 0),
            x = (TrashFire.trashOrigin.x - (trashWidthSum * 0.5)) +
                (sum + (i * offset));
        return "translate(" + x + "," + (d.size * -0.5) + ")";
    }

    var trashSelection = trashContainer.selectAll(".trash")
        .data(trash);

    // EXIT
    trashSelection.exit()
        .transition().duration(1000)
        .attr("transform", function () {
            return "translate(" + TrashFire.trashOrigin.x + "," + TrashFire.trashOrigin.y + ")";
        })
        .style("opacity", 0)
        .remove();

    // UPDATE
    trashSelection
        .transition().duration(1000)
        .attr("transform", trashPosition);

    // ENTER
    var trashes = trashSelection.enter()
        .append("g").attr("class", "trash")
            .attr("transform", function () {
                return "translate(" + TrashFire.trashOrigin.x + "," + TrashFire.trashOrigin.y + ")";
            });
    trashes.transition().duration(1000)
    .attr("transform", trashPosition);

    trashes.append("path")
        .style("opacity", 0)
        .attr("stroke", "grey")
        .attr("fill", "none")
        .attr("d", function(d) {
            var w = 5, h = d.size;
            return "M" + w + ",0 L0,0 L0," + h + " L" + w + "," + h + " " +
                "M" + (h - w) + "," + h + "L" + h + "," + h + " L" + h + "," + 0 + " L" + (h - w) + "," + 0;
        })
        .transition().duration(1000)
        .style("opacity", 1);
    trashes.call(makeCircle);
}
