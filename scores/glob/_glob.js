var radius = 96;

function newPoint(x, y) {
    var r = VS.getRandExcl(1, radius), // TODO allow radius to be set
        angle = Math.random() * Math.PI * 2,
        d = Math.random() - Math.random();
    return {
        x: (Math.cos(angle) * r * d) + x,
        y: (Math.sin(angle) * r * d) + y
    };
}

/**
 * Create a cloud of elements
 * @constructor
 * @param {D3Selection} parent - Parent element to which the Glob is appended
*/
function Glob(parent, args) {
    args = args || {};

    this.group = parent.append('g')
        .attr('transform',
            'translate(' + (canvas.center - 11) + ', ' + canvas.center + ')');

    this.size = args.n || 8;

    this.center = {
        x: 0,
        y: 0
    };

    // this.data = d3.range(this.size); // fallback if no data
}

Glob.prototype.move = function(dur, data) {
    var self = this,
        type = data.type,
        t = d3.transition().duration(dur).ease(d3.easeCubic);

    // this.data = data;

    function clone(o) {
        return JSON.parse(JSON.stringify(o));
    }

    var oldCenter = clone(this.center);

    this.center = {
        x: VS.getRandExcl(-radius, radius),
        y: VS.getRandExcl(-radius, radius)
    };

    function transform() {
        var point = newPoint(self.center.x, self.center.y);
        if (type === 'chord') {
            point.x = 0;
        } else if (type === 'rhythm') {
            point.y = 0;
        }
        return 'translate(' + point.x + ', ' + point.y + ')';
    }

    var globules = this.group.selectAll('.globule')
        .data(data.durations);

    // exit
    globules.exit()
        .transition(t)
        .attr('transform', 'translate(' + this.center.x + ',' + this.center.y + ')')
        .style('opacity', 0)
        .remove();

    // update
    globules
        .transition(t)
        .attr('transform', transform);

    // enter
    globules
        .enter().append('text')
        .attr('class', 'globule')
        .text(function(d) {
            return durationDict[d];
        })
        .attr('transform', 'translate(' + oldCenter.x + ',' + oldCenter.y + ')')
        .style('opacity', 0)
        .transition(t)
        .attr('transform', transform)
        .style('opacity', 1);
};
