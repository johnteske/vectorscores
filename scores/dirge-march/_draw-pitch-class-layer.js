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
        calculateTransformLinePoints(selection, width, data);
        pitchClassGroup.call(drawPitchClassLines);
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

    function calculateTransformLinePoints(selection, width, data) {
        // Save rendered dimensions
        selection.selectAll('.pitch-class').each(function(d) {
            d.BBox = d3.select(this).node().getBBox();
        });

        var linePadding = 6;

        data.pitch.forEach(function(current, index, array) {
            if (current.type !== 'transform') {
                return;
            }

            var previous = array[index - 1];
            var next = array[index + 1];

            if ((index - 1) > -1) {
                current.x1 = previous.BBox.x + previous.BBox.width + linePadding;
            } else {
                current.x1 = 0;
            }

            if (index + 1 < array.length) {
                current.x2 = next.BBox.x - linePadding;
            } else {
                current.x2 = width;
            }
        });
    }

    function drawPitchClassLines(selection) {
        selection
            .filter(filterSets(false))
            .append('line')
            .attr('x1', function(d) {
                return d.x1;
            })
            .attr('x2', function(d) {
                return d.x2;
            })
            .attr('y1', y)
            .attr('y2', y)
            .attr('stroke', 'grey')
            .attr('stroke-dasharray', '3')
            .attr('marker-end', 'url(#arrow-marker)');
    }

    return drawPitchClassLayer;
}());
