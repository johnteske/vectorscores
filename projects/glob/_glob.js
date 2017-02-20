/**
 * Create a cloud of elements
 * @constructor
 * @param {D3Selection} parent - Parent element to which the Glob is appended
 * @param {Integer} n - Number of elements in the Glob
*/
function Glob(parent, n, element) {
    if (!(this instanceof Glob)) {
        return new Glob();
    }

    this.group = parent.append("g");
    this.size = n;
    this.element = element;

    // fallback if no data
    this.data = d3.range(this.size);

    // create children, assuming uniform children for now
    this.children = this.group.selectAll(this.element)
        .data(this.data).enter()
        .append(this.element);
}
