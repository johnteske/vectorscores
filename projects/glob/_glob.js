/**
 * Create a cloud of elements
 * @constructor
 * @param {D3Selection} parent - Parent element to which the Glob is appended
 * @param {Integer} n - Number of elements in the Glob
*/
function Glob(parent, n) {
    if (!(this instanceof Glob)) {
        return new Glob();
    }
    this.size = n;
    this.group = parent.append("g");
}

Glob.prototype.draw = function() {
    // TODO demo element, until custom elements can be defined
    this.group.selectAll("ellipse")
        .data(d3.range(this.size)).enter()
        .append("ellipse")
            .attr("cx", 5)
            .attr("cy", 5)
            .attr("rx", 5) // 4, rotate(60) to approx quarter notehead
            .attr("ry", 5);
};
