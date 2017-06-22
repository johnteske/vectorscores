/**
 * Generate test trash
 */
var trash = [];

var lineGenerator = d3.svg.line()
    .x(function(d) { return d[0]; })
    .y(function(d) { return d[1]; });
    // .interpolate("basis");
function makePath(selection) {
    selection.each(function(d) {
        var nPoints = 60,
            margin = 10,
            slice = (d.size - (margin * 2)) / (nPoints + 1),
            height;

        if (d.type === "blaze") {
            height = d.size * 0.67;
        } else {
            height = 3;
        }

        d.pathPoints = [];

        var j;

        if (d.type !== "embers") {
            for (j = 0; j < nPoints; j++) {
                d.pathPoints.push([
                    margin + (j * slice),
                    (d.size * 0.5 - (height * 0.5)) + (Math.random() * height)
                ]);
            }
        } else {
            for (j = 0; j < nPoints; j++) {
                d.pathPoints.push([
                    margin + (j * slice),
                    d.size - margin - (j * slice) + (Math.random() * height)
                ]);
            }
        }
    });

    selection.append("path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", function(d) { return d.type !== "embers" ? 2 : 1; })
        .style("opacity", function(d) {
            return d.type === "blaze" || d.type === "scrape" ? 1 : 0.5;
        })
        .attr("d", function(d) {
            return lineGenerator(d.pathPoints);
        });
}

function updateTrash(duration) {
    var dur = duration || 1000;
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
                (sum + (i * offset)),
            y = d.size * -0.5 - 50;
        return "translate(" + x + "," + y + ")";
    }

    var trashSelection = trashContainer.selectAll(".trash")
        .data(trash);

    // EXIT
    trashSelection.exit()
        .transition().duration(dur)
        .attr("transform", function () {
            return "translate(" + TrashFire.trashOrigin.x + "," + TrashFire.trashOrigin.y + ")";
        })
        .style("opacity", 0)
        .remove();

    // UPDATE
    trashSelection
        .transition().duration(dur)
        .attr("transform", trashPosition);

    // ENTER
    var trashes = trashSelection.enter()
        .append("g").attr("class", "trash")
            .attr("transform", function () {
                return "translate(" + TrashFire.trashOrigin.x + "," + TrashFire.trashOrigin.y + ")";
            });
    trashes.transition().duration(dur)
        .attr("transform", trashPosition);

    // make brackets
    trashes.append("path")
        .style("opacity", 0)
        .attr("stroke", "grey")
        .attr("fill", "none")
        .attr("d", function(d) {
            var w = 5, h = d.size;
            return "M" + w + ",0 L0,0 L0," + h + " L" + w + "," + h + " " +
                "M" + (h - w) + "," + h + "L" + h + "," + h + " L" + h + "," + 0 + " L" + (h - w) + "," + 0;
        })
        .transition().duration(dur)
        .style("opacity", 1);

    trashes.call(makePath);
}
