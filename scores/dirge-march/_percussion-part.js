var percussionPart = (function() {
    var part = {};

    var bars;

    var numberOfParts = config.numberOfPercussionParts;

    var rhythmLayout = {
        padding: 6,
        height: 24
    };

    rhythmLayout.boxHeight = (rhythmLayout.height * numberOfParts) + (rhythmLayout.padding * (numberOfParts + 1));

    part.init = function(parent) {
        bars = parent.selectAll('g')
            .data(parts.percussion)
            .enter()
            .append('g')
            .attr('transform', function(d) {
                return 'translate(' + getXByScoreIndex(d.index) + ',' + 0 + ')';
            });
    };

    part.draw = function() {
        drawTempi();
        drawBars();
    };

    function drawTempi() {
        var text = bars.append('text')
            .attr('class', 'tempo-text')
            .attr('dy', '-0.5em');

        text.append('tspan').text(rhythms.stringToBravuraMap['1']);

        text.append('tspan').text(' = ')
            .style('letter-spacing', '-0.125em')
            .attr('class', 'bpm');

        text.append('tspan').text(function(d) {
            return d.percussion.tempo;
        })
        .attr('class', 'bpm');
    }

    function drawBars() {
        drawBoundingRect();
        drawRhythms();
        setBoundingRectWidth();
        drawDurationLine();
        drawDynamics();
    }

    function drawBoundingRect() {
        bars.append('rect')
            .attr('height', rhythmLayout.boxHeight)
            .attr('stroke', 'black')
            .attr('fill', 'white');
    }

    function drawRhythms() {
        var rhythms = bars.selectAll('.rhythm')
            .data(function(d) {
                return d.percussion.rhythmIndices;
            })
            .enter()
            .append('text')
            .attr('class', 'rhythm')
            .attr('y', function(d, i) {
                return i * (rhythmLayout.height + rhythmLayout.padding);
            })
            .attr('dy', 16 + rhythmLayout.padding)
            .attr('dx', rhythmLayout.padding);

        rhythms.call(appendTspans);
    }

    function appendTspans(selection) {

        var tspans = selection.selectAll('tspan')
            .data(rhythms.getTextFragmentsFromIndices)
            .enter()
            .append('tspan');

        // Unordered set characters
        tspans.filter(function(d) { return isSetCharacter(d); })
            .text(function(d) {
                return d;
            })
            .style('font-family', 'monospace')
            .style('font-size', 18);

        // Rhythms
        tspans.filter(function(d) { return !isSetCharacter(d); })
            .text(function(d) {
                return rhythms.stringToBravuraMap[d];
            })
            .style('font-family', 'Bravura')
            .style('font-size', 12)
            .style('baseline-shift', function(d) {
                var dy = (d === 'r0.5' || d === 'r0.5.') ? 0.4 : 0;
                return dy + 'em';
            })
            .style('letter-spacing', function(d) {
                var spacing = 0;

                if (d === 'trip') {
                    spacing = -6;
                } else if (d === '1.') {
                    spacing = -5;
                }

                return spacing;
            });

        function isSetCharacter(string) {
            return '{,}'.indexOf(string) !== -1;
        }
    }

    function setBoundingRectWidth() {
        bars.each(function(d) {
            var groupWidth = d3.select(this).node().getBBox().width;
            d.width = groupWidth + rhythmLayout.padding;
        });

        bars.selectAll('rect')
            .attr('width', function(d) {
                return d.width;
            });
    }

    function drawDurationLine() {
        var y = rhythmLayout.boxHeight * 0.5;

        bars.append('line')
            .attr('x1', function(d) {
                return d.width;
            })
            .attr('x2', function(d) {
                var nextBarTime = d.time + d.percussion.duration;
                var nextBarIndex = barTimes.indexOf(nextBarTime);
                return getXByScoreIndex(nextBarIndex) - getXByScoreIndex(d.index);
            })
            .attr('y1', y)
            .attr('y2', y)
            .attr('stroke', 'black')
            .attr('stroke-width', 3);
    }

    function drawDynamics() {
        bars.each(function(data) {
            // TODO unlike the pitched part, `data` is not the percussion object, it is the full bar?
            data = data.percussion;

            var selection = d3.select(this);
            var width = layout.scaleTime(data.duration);
            var dynamicsData = data.dynamics.map(function(dynamic) {
                dynamic.duration = data.duration;
                return dynamic;
            });

            var dynamicsGroup = selection.append('g')
                .attr('class', 'dynamics')
                .attr('transform', 'translate(0,' + rhythmLayout.boxHeight + ')')
                .selectAll('.dynamic')
                .data(dynamicsData)
                .enter();

            dynamicsGroup.filter(includeCrescendos(false))
                .call(appendDynamics);

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

    return part;
}());
