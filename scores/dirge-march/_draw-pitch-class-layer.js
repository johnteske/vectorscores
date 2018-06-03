function createArrowMarker() {
    var marker = svg.select('defs')
        .append('marker')
        .attr('id', 'arrow-marker')
        .attr('markerWidth', '9')
        .attr('markerHeight', '6')
        .attr('refX', '8')
        .attr('refY', '3')
        .attr('orient', 'auto')
        .attr('markerUnits', 'strokeWidth');

    marker.append('path')
        .attr('d', 'M0,0 L9,3 L0,6')
        .attr('fill', 'grey');
}

var drawPitchClassLayer = (function() {

    var y = '-1.5em';

    function filterSets(isSet) {
        return function(d) {
            return isSet === (d.type !== 'transform');
        };
    }

    function drawPitchClassLayer(data) {
        var selection = d3.select(this);
        var width = layout.scaleTime(data.duration);

        var pitchClassGroup = selection.append('g')
            .selectAll('.pitch-class')
            .data(data.pitch)
            .enter();

        pitchClassGroup.call(drawPitchClassText, width);
        calculateJoiningSymbolPoints(selection.selectAll('.pitch-class'), width, data.pitch, function(d) { return d.type === 'transform'; });
        pitchClassGroup.call(drawPitchClassLines, width);
    }

    function drawPitchClassText(selection, width) {
        selection.filter(filterSets(true))
            .append('text')
            .attr('class', 'pitch-class')
            .attr('x', function(d) {
                return d.time * width;
            })
            .attr('dy', y)
            .attr('text-anchor', function(d) {
                return textAnchor(d.time);
            })
            .text(function(d) {
                var set = VS.pitchClass.transpose(d.classes, config.semitoneTransposition).map(function(pc) {
                    return VS.pitchClass.format(+pc, scoreOptions.pitchClasses.display, scoreOptions.pitchClasses.preference);
                });

                return '{' + set + '}';
            });
    }

    function drawPitchClassLines(selection, width) {
        var linePadding = 6;

        selection
            .filter(filterSets(false))
            .append('line')
            .attr('x1', function(d) {
                return d.x1 === 0 ? d.x1 : d.x1 + linePadding;
            })
            .attr('x2', function(d) {
                return d.x2 === width ? d.x2 : d.x2 - linePadding;
            })
            .attr('y1', y)
            .attr('y2', y)
            .attr('stroke', 'grey')
            .attr('stroke-dasharray', '3')
            .attr('marker-end', 'url(#arrow-marker)');
    }

    return drawPitchClassLayer;
}());
