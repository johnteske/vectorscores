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
        drawRhythms();
        drawBoundingRect();
        drawDurationLine();
        drawDynamics();
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

    function drawBoundingRect() {
        bars.each(function(d) {
            var groupWidth = d3.select(this).node().getBBox().width;
            d.width = groupWidth + rhythmLayout.padding;
        });

        bars.append('rect')
            .attr('width', function(d) {
                return d.width;
            })
            .attr('height', rhythmLayout.boxHeight)
            .attr('stroke', 'black')
            .attr('fill', 'none');
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
        function dynamicsData(d) {
            return d.percussion.dynamics.map(function(dynamicObject) {
                dynamicObject.duration = d.percussion.duration;
                return dynamicObject;
            });
        }

        bars.call(appendDynamics, dynamicsData, rhythmLayout.boxHeight);
    }

    return part;
}());
