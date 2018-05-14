var percussionPart = (function() {
    var part = {};
    var bars;

    part.init = function(parent) {
        bars = parent.selectAll('g')
            .data(score2)
            .enter()
            .append('g')
            .attr('transform', function(d) {
                return 'translate(' + (d.time * timeScale) + ',' + 0 + ')';
            });
    };

    part.draw = function() {
        drawTempi();
    };

    // TODO de-duplicate repeat tempi, or allow option to hide/show
    function drawTempi() {
        bars.filter(function(d) {
            return d.percussion.tempo !== null;
        }).call(function(selection) {
            var text = selection.append('text').attr('class', 'tempo-text');

            text.append('tspan').text(stemmed['1']);
            text.append('tspan').text(function(d) {
                return ' = ' + d.percussion.tempo;
            })
            .attr('class', 'bpm');
        });
    }

    return part;
}());
