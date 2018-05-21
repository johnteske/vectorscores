var pitchedPart = (function() {
    var part = {};

    var bars;

    part.init = function(parent) {
        bars = parent.selectAll('g')
            .data(parts.pitched)
            .enter()
            .append('g')
            .attr('transform', function(d) {
                return 'translate(' + (d.time * timeScale) + ',' + 0 + ')';
            });
    };

    part.draw = function() {
        drawGlobjects();
        drawPitchClasses();
        drawDynamics();
        drawRests();
    };

    var staticGlobject = VS.globject()
        .width(function(d) {
            return d.duration * timeScale;
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
        bars.each(globjectText);
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
        .attr('class', 'rest');

        function getBarCenterX(d) {
            return d.duration * timeScale * 0.5;
        }

        rest.append('tspan')
            .attr('x', getBarCenterX)
            .attr('y', (globjectHeight * 0.5) - 20)
            .text('\ue4c6');

        rest.append('tspan')
            .attr('x', getBarCenterX)
            .attr('y', globjectHeight * 0.5)
            .text('\ue4e5');
    }

    return part;
}());
