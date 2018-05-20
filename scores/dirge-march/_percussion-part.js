var percussionPart = (function() {
    var part = {};
    var bars;

    var nParts = 2;
    var maxRhythms = 2;

    var padding = 6;
    var rhythmHeight = 24;
    var boxHeight = (rhythmHeight * nParts) + (padding * (nParts + 1));

    part.init = function(parent) {
        bars = parent.selectAll('g')
            .data(parts.percussion)
            .enter()
            .append('g')
            .attr('transform', function(d) {
                return 'translate(' + (d.time * timeScale) + ',' + 0 + ')';
            });
    };

    part.draw = function() {
        drawTempi();
        drawBars();
    };

    function drawTempi() {
        bars.call(function(selection) {
            var text = selection.append('text')
                .attr('class', 'tempo-text')
                .attr('dy', '-0.5em');

            text.append('tspan').text(stemmed['1']);

            text.append('tspan').text(' = ')
                .style('letter-spacing', '-0.125em')
                .attr('class', 'bpm');

            text.append('tspan').text(function(d) {
                return d.percussion.tempo;
            })
            .attr('class', 'bpm');
        });
    }

    function drawBars() {
        bars.call(drawRhythms);
        bars.call(drawBoundingRect);
        bars.call(drawDurationLine);
        bars.call(drawDynamics);
    }

    function drawRhythms(selection) {
        selection.selectAll('.rhythm')
            .data(function(d) {
                return d.percussion.rhythmIndices;
            })
            .enter()
            .append('text')
            .attr('class', 'rhythm')
            .attr('y', function(d, i) {
                return i * (rhythmHeight + padding);
            })
            .attr('dy', 16 + padding)
            .attr('dx', padding)
            .selectAll('tspan')
                .data(constructTspans)
                .enter()
                .append('tspan')
                .call(styleTspan);
    }

    function constructTspans(d) {
        var rhythmStrings = d.map(function(index) {
            return rhythms[index].split(',');
        });

        function flattenWithCommasBetween(array) {
            return array.reduce(function(a, b) {
                return a.concat(b, [',']);
            }, []);
        }

        var string = flattenWithCommasBetween(rhythmStrings);
        string.pop(); // remove last comma

        string.unshift('{');
        string.push('}');

        return string;
    }

    function styleTspan(tspanSelection) {

        function isSetCharacter(string) {
            return '{,}'.indexOf(string) !== -1;
        }

        // Unordered set characters
        tspanSelection.filter(function(d) { return isSetCharacter(d); })
            .text(function(d) {
                return d;
            })
            .style('font-family', 'monospace')
            .style('font-size', 18);

        // Rhythms
        tspanSelection.filter(function(d) { return !isSetCharacter(d); })
            .text(function(d) {
                return stemmed[d];
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
    }

    function drawBoundingRect(selection) {
        selection.each(function(d) {
            var groupWidth = d3.select(this).node().getBBox().width;
            d.width = groupWidth + padding;
        });

        selection.append('rect')
            .attr('width', function(d) {
                return d.width;
            })
            .attr('height', boxHeight)
            .attr('stroke', 'black')
            .attr('fill', 'none');
    }

    function drawDurationLine(selection) {
        selection.append('line')
            .attr('x1', function(d) {
                return d.width;
            })
            .attr('x2', function(d) {
                return d.percussion.duration * timeScale;
            })
            .attr('y1', boxHeight * 0.5)
            .attr('y2', boxHeight * 0.5)
            .attr('stroke', 'black')
            .attr('stroke-width', 3);
    }

    function drawDynamics(selection) {
        function dynamicsData(d) {
            return d.percussion.dynamics.map(function(dynamicObject) {
                dynamicObject.duration = d.percussion.duration;
                return dynamicObject;
            });
        }

        selection.call(appendDynamics, dynamicsData, boxHeight);
    }

    return part;
}());
