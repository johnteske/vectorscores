function newPoint() {
    var radius = VS.getRandExcl(1, 96),
        angle = Math.random() * Math.PI * 2,
        dist = Math.random() - Math.random();
    return {
        x: Math.cos(angle) * radius * dist,
        y: Math.sin(angle) * radius * dist
    };
}

/**
 * Create a cloud of elements
 * @constructor
 * @param {D3Selection} parent - Parent element to which the Glob is appended
*/
function Glob(parent, args) {
    args = args || {};

    this.group = parent.append("g");

    this.size = args.n || 8;

    // this.data = d3.range(this.size); // fallback if no data
}

Glob.prototype.move = function(dur, data) {
    var t = d3.transition().duration(dur),
        type = data.type;

    // this.data = data;

    function transform() {
        var point = newPoint();
        if (type === "chord") {
            point.x = 0;
        } else if (type === "rhythm") {
            point.y = 0;
        }
        return "translate(" + point.x + ", " + point.y + ")";
    }

    var globules = this.group.selectAll(".globule")
        .data(data.durations, function(d) { return d; });

    // exit
    globules.exit()
        .transition(t)
        .attr("transform", "translate(0,0)")
        .style("opacity", 0)
        .remove();

    // update
    globules
        .transition(t)
        .attr("transform", transform);

    // enter
    globules
        .enter().append("text")
        .attr("class", "globule")
        .text(function(d) {
            return durationDict[d];
        })
        .style("opacity", 0)
        .transition(t)
        .attr("transform", transform)
        .style("opacity", 1);
};
