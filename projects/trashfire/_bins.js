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
        x: 30,
        y: -120
    };

    function buglog() {
        console.log(_contents);
    }

    function add(trash) {
        var thisBin = {
            trash: trash,
            box: trash.group.append("rect")
        };
        _contents.push(thisBin);

        trash.group
            .transition()
            .duration(2000)
            .attr("transform", "translate(" + this.center.x + ","  + this.center.y + ")")
            .each("end", function() {

                thisBin.box
                    .attr("fill", "none")
                    .attr("stroke", "grey")
                    .attr("width", trash.width)
                    .attr("height", trash.height)
                    .style("opacity", 0)
                    .transition()
                    .duration(150)
                    .style("opacity", 1);

            });
        buglog();
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
            .attr("transform", "translate(" + this.center.x + ","  + 0 + ")")
            .remove();

        // TODO elements removed but trash object remains

        _contents.splice(index, 1);
        // by selection/selector, remove all that match
        // for (var i = 0; i < _contents.length; i++) {
        //     if (_contents[i].selection === selection) _contents.splice(i, 1);
        // }

        buglog();
    }

    return {
        //    size: _contents.length,
        center: center,
        add: add,
        remove: remove
    };
})();
