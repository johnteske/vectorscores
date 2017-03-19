/**
 * Bins
 * These hold Trash--used to add layers for performers to choose from
 */
var bins = (function() {
    var _contents = [];
    var group = worldSVG.append("g");
    var center = {
        x: 0,
        y: -90 // TODO center is set relative to dumpster--keep this for easy animation calculations?
    };

    // TODO allow a bin/position to be specified
    function add(selection) {
        _contents.push(selection);

        // TODO use brackets (Bravura font?), not boxes
        group.append("rect")
            .attr("x", 210)
            .attr("y", 60)
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("width", 60)
            .attr("height", 60);

        // TODO center is set relative to dumpster--keep this for easy animation calculations?
        selection
            .transition()
            .duration(2000)
            .attr("cy", this.center.y);
   }

   // TODO should accept index--but also selection?
   // as in, a bin could be removed by index OR selection/selector?
   function remove(selection) {
    //    _contents.push(selection); // TODO remove from _contents
        selection
            .transition()
            .duration(2000)
            .attr("cy", 60); // back into g.trash // for demo
   }

    return {
     //    size: _contents.length,
        center: center,
        add: add,
        remove: remove
    };
})();
