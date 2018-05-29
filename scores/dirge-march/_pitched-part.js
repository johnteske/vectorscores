var pitchedPart = (function() {
    var part = {};

    var bars;

    part.init = function(parent) {
        bars = parent.selectAll('g')
            .data(parts.pitched)
            .enter()
            .append('g')
            .attr('transform', function(d, i) {
                return 'translate(' + getXByScoreIndex(d.index) + ',' + 0 + ')';
            });

        createFillPattern();
        createArrowMarker();
};

    function createFillPattern() {
        var pattern = svg.select('defs')
            .append('pattern')
            .attr('id', 'ascending-fill')
            .attr('width', 2)
            .attr('height', 2)
            .attr('patternUnits', 'userSpaceOnUse');

        pattern.append('circle')
            .attr('fill', '#eee')
            .attr('r', 1);
    };

    part.draw = function() {
        drawGlobjects();
        drawPitchClasses();
        drawDynamics();
        drawRests();
    };

    var staticGlobject = VS.globject()
        .width(function(d) {
            return layout.scaleTime(d.duration);
        })
        .height(globjectHeight)
        .curve(d3.curveCardinalClosed.tension(0.3));

    function drawGlobjects() {
        bars
        .selectAll('.globject')
            .data(function(d) {
                return d.globjects.map(function(globject) {
                    return {
                        duration: d.duration,
                        pitch: d.pitch,
                        phraseType: d.phraseType,
                        rangeEnvelope: globject.rangeEnvelope
                    };
                });
            })
            .enter()
            .append('g')
            .attr('class', 'globject')
            .attr('transform', function(d, i) {
                return 'translate(0,' + (i * globjectHeight) + ')';
            })
            .each(staticGlobject)
            .each(fillGlobject);
    }

    function drawPitchClasses() {
        bars.each(drawPitchClassLayer);
    }

    function drawDynamics() {
        function dynamicsData(d) {
            return d.dynamics.map(function(dynamic) {
                dynamic.duration = d.duration;
                return dynamic;
            });
        }

        bars.call(appendDynamics, dynamicsData, globjectHeight);
    }

    function drawRests() {
        var rest = bars.filter(function(d) {
            return d.phraseType === 'rest';
        })
        .append('text')
        .attr('class', 'rest')
        .attr('y', globjectHeight * 0.5);

        // Half rest
        rest.append('tspan').text('\ue4f5');

        // Dot
        rest.append('tspan').text('\ue1fc').attr('dx', '0.25em');
    }

    return part;
}());
