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
            .data(processData())
            .enter()
            .append('g')
            .attr('transform', function(d) {
                return 'translate(' + (d.time * timeScale) + ',' + 0 + ')';
            });
    };

    function processData() {
        return score2.filter(function(d) {
            return d.percussion.tempo !== null;
        })
        .map(function(d) {
            d.percussion.rhythmIndices = [];

            for (var i = 0; i < nParts; i++) {
                d.percussion.rhythmIndices.push(getRhythmIndices(d.percussion.rhythmRange));
            }

            return d;
        });
    }

    function getRhythmIndices(extent) {
        var availableIndices = [];

        for (var i = extent[0]; i <= extent[1]; i++) {
            availableIndices.push(i);
        }

        shuffle(availableIndices);

        var selectedIndices = [];
        var n = Math.min(availableIndices.length, maxRhythms);

        for (var j = 0; j < n; j++) {
            selectedIndices.push(availableIndices.pop());
        }

        return selectedIndices;
    }

    // Use randomly sorted arrays to select from with Array#pop to avoid duplicate selections
    // TODO use for the pitched globject selection as well
    // https://www.frankmitchell.org/2015/01/fisher-yates/
    function shuffle(array) {
        var i = 0;
        var j = 0;
        var temp = null;

        for (i = array.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    part.draw = function() {
        drawTempi();
        drawBars();
    };

    // TODO de-duplicate repeated tempi, or allow option to hide/show
    function drawTempi() {
        bars.call(function(selection) {
            var text = selection.append('text').attr('class', 'tempo-text');

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
    }

    function drawRhythms(selection) {
        selection.selectAll('.rhythm')
            .data(function(d) {
                return d.percussion.rhythmIndices;
            })
            .enter()
            .append('text')
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
        })

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

    return part;
}());
