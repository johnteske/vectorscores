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

    // fallback if no data
    this.data = d3.range(this.size);

    this.children = null;
}

Glob.prototype.move = function(dur, type) {
    this.children
        .transition().duration(dur)
        .attr("text-anchor", "start")
        .attr("transform", function() {
            var point = newPoint();
            if (type === "chord") {
                point.x = 0;
            } else if (type === "rhythm") {
                point.y = 0;
            }
            return "translate(" + point.x + ", " + point.y + ")";
        });
};
