/**
 * Bins
 * These hold Trash--used to add layers for performers to choose from
 */

// TODO center is set relative to dumpster--keep this for easy animation calculations?
// TODO add() should allow bin position to be specified
// TODO remove() should allow either bin index OR selection to be specified
// TODO use brackets (Bravura font?), not boxes

var bins = (function() {
    var _contents = [];
    var _group = dumpster.trash; // worldSVG.append("g");

    var center = {
        x: dumpster.center.x,
        y: -120
    };

    function calcBinPositions() {
        var spread = 30,
            nBins = _contents.length;
        for (var i = 0; i < nBins; i++) {
            var x = center.x + (i * spread) - ((nBins - 1) * spread * 0.5);
            _contents[i].x = x;
            _contents[i].y = -120;
        }
    }

    function translateBins() {
        var nBins = _contents.length;
        for (var i = 0; i < nBins; i++) {
            var thisBin = _contents[i];
            thisBin.trash.group
                .transition()
                .duration(2000)
                .attr("transform", "translate(" + thisBin.x + ","  + thisBin.y + ")");
        }
    }

    function add(trash) {
        var thisBin = {
            trash: trash,
            box: trash.group.append("rect"),
            x: 0,
            y: 0
        };
        trash.group.classed("bin", 1); // for easy selection
        _contents.push(thisBin);

        calcBinPositions();

        translateBins();

        // for easy selection
        // trash.group
        //     .transition()
        //     .duration(2000)
        //     .attr("transform", "translate(" + thisBin.x + ","  + thisBin.y + ")")
        //     .each("end", function() {
        //
        //         thisBin.box
        //             .attr("fill", "none")
        //             .attr("stroke", "grey")
        //             .attr("width", trash.width)
        //             .attr("height", trash.height)
        //             .style("opacity", 0)
        //             .transition()
        //             .duration(150)
        //             .style("opacity", 1);
        //
        //     });
    }

    function remove(index) {
        var thisBin = _contents[index];

        thisBin.box
            .transition()
            .duration(150)
            .style("opacity", 0)
            .remove();

        thisBin.trash.group
            .transition()
            .duration(2000)
            .attr("transform", "translate(" + dumpster.center.x + ","  + dumpster.center.y + ")")
            .remove();

        // TODO elements removed but trash object remains

        _contents.splice(index, 1);
        // by selection/selector, remove all that match
        // for (var i = 0; i < _contents.length; i++) {
        //     if (_contents[i].selection === selection) _contents.splice(i, 1);
        // }
    }

    return {
        //    size: _contents.length,
        center: center,
        add: add,
        remove: remove
    };
})();
