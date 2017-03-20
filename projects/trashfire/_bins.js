/**
 * Bins
 * These hold Trash--used to add layers for performers to choose from
 */
var bins = (function() {
    var _contents = [];
    var _group = worldSVG.append("g");
    var center = {
        x: 0,
        y: -90 // TODO center is set relative to dumpster--keep this for easy animation calculations?
    };

    // TODO allow a bin/position to be specified
    function add(selection) {
        _contents.push(selection);

        // TODO center is set relative to dumpster--keep this for easy animation calculations?
        selection
            .transition()
            .duration(2000)
            .attr("cy", this.center.y)
            .each("end", function() {

                // TODO use brackets (Bravura font?), not boxes
                _group.append("rect")
                    .attr("x", 210)
                    .attr("y", 60)
                    .attr("fill", "none")
                    .attr("stroke", "grey")
                    .attr("width", 60)
                    .attr("height", 60);

            });
    }

    // TODO should accept index--but also selection?
    // as in, a bin could be removed by index OR selection/selector?
    function remove(selection) {
        // by selection/selector, remove all that match
        for (var i = 0; i < _contents.length; i++) {
            if (_contents[i] === selection) _contents.splice(i, 1);
        }

        _group.selectAll("rect").remove();

        selection
            .transition()
            .duration(2000)
            .attr("cy", 60) // back into g.trash // for demo
            .remove(); // destroy
    }

    return {
        //    size: _contents.length,
        center: center,
        add: add,
        remove: remove
    };
})();
