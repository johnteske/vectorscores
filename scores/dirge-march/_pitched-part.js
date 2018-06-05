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
        bars.each(function(data) {
            var selection = d3.select(this);
            var width = layout.scaleTime(data.duration);

            var dynamicsData = data.dynamics.map(function(dynamic) {
                dynamic.duration = data.duration;
                return dynamic;
            });

            var dynamicsGroup = selection.append('g')
                .attr('class', 'dynamics')
                .attr('transform', 'translate(0,' + globjectHeight + ')')
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

    // TODO draw text if above a certain width
    function drawCrescendos(selection, width) {
        var linePadding = 10;
        var y = 20;
        var height = 10;
        var halfHeight = height * 0.5;
        var lineWidthThreshold = 100;

        var line = d3.line()
            .x(function(d) { return d[0]; })
            .y(function(d) { return d[1]; });

        selection
            .filter(function(d) {
                return d.x2 - d.x1 < lineWidthThreshold;
            })
            .append('path')
            .attr('transform', 'translate(0,' + y + ')')
            .attr('d', function(d) {
                var x1 = (d.x1 === 0) ? d.x1 : d.x1 + linePadding;
                var x2 = (d.x2 === width) ? d.x2 : d.x2 - linePadding;
                var hairpinStart;
                var hairpinEnd;

                if (d.value === '<') {
                    hairpinStart = x1;
                    hairpinEnd = x2;
                } else {
                    hairpinStart = x2;
                    hairpinEnd = x1;
                }

                var points = [
                    [hairpinEnd, halfHeight],
                    [hairpinStart, 0],
                    [hairpinEnd, -halfHeight]
                ];

                return line(points);
            })
            .attr('stroke', '#222222')
            .attr('fill', 'none');

        selection
            .filter(function(d) {
                return d.x2 - d.x1 > lineWidthThreshold;
            })
            .append('text')
            // .attr('class', 'dynamic text')
            .attr('x', function(d) {
                return layout.scaleTime(d.time * d.duration);
            })
            .attr('y', y)
            .attr('dy', '0.3em')
            .text(function(d) {
                if (d.value === '<') {
                    return 'cres.';
                } else {
                    return 'dim.';
                }
            })
            .style('font-family', 'serif')
            .style('font-size', 15)
            .style('font-style', 'italic');
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
