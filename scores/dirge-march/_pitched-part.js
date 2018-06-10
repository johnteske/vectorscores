var globjectHeight = 42;

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
                        totalGlobjects: d.globjects.length,
                        pitch: d.pitch,
                        range: d.range,
                        phraseType: d.phraseType,
                        rangeEnvelope: globject.rangeEnvelope
                    };
                });
            })
            .enter()
            .append('g')
            .attr('class', 'globject')
            .attr('transform', function(d, i) {
                var y = VS.getRandIntIncl(d.range.low + globjectHeight, d.range.high);

                // TODO this is an easy way to space out the globjects--
                // replace with a real bin-packing algorithm so globjects can fit closely together
                if (d.totalGlobjects > 1) {
                    y = (layout.pitched.globjects.height / d.totalGlobjects) * (i + 1);
                }

                return 'translate(0,' + (layout.pitched.globjects.height - y) + ')';
            })
            .each(staticGlobject)
            .each(fillGlobject);
    }

    function drawPitchClasses() {
        bars.each(drawPitchClassLayer);
    }

    function drawDynamics() {
        bars.each(function(data) {
            var selection = d3.select(this);
            var width = layout.scaleTime(data.duration);

            var dynamicsData = data.dynamics.map(function(dynamic) {
                dynamic.duration = data.duration;
                return dynamic;
            });

            var dynamicsGroup = selection.append('g')
                .attr('class', 'dynamics')
                .attr('transform', 'translate(0,' + layout.pitched.globjects.height + ')')
                .selectAll('.dynamic')
                .data(dynamicsData)
                .enter();

            dynamicsGroup.filter(includeCrescendos(false))
                .call(appendDynamics2);

            calculateJoiningSymbolPoints(dynamicsGroup.selectAll('text'), width, dynamicsData, includeCrescendos(true));

            dynamicsGroup.filter(includeCrescendos(true))
                .call(drawCrescendos, width);

            function includeCrescendos(include) {
                return function(d) {
                    return include === ('<>'.indexOf(d.value) !== -1);
                };
            }
        });
    }

    function drawRests() {
        var rest = bars.filter(function(d) {
            return d.phraseType === 'rest';
        })
        .append('text')
        .attr('class', 'rest')
        .attr('y', layout.pitched.globjects.height * 0.5);

        // Half rest
        rest.append('tspan').text('\ue4f5');

        // Dot
        rest.append('tspan').text('\ue1fc').attr('dx', '0.25em');
    }

    return part;
}());
