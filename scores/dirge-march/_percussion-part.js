var percussionPart = (function() {
    var part = {};
    var bars;

    var nParts = 2;
    var nRhythms = 2;

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

        for (var j = 0; j < nRhythms; j++) {
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
            text.append('tspan').text(function(d) {
                return ' = ' + d.percussion.tempo;
            })
            .attr('class', 'bpm');
        });
    }

    function drawBars() {
        bars.selectAll('.rhythm-wrapper')
            .data(function(d) {
                return d.percussion.rhythmIndices;
            })
            .enter()
            .append('g')
            .attr('class', 'rhythm-wrapper')
            .attr('transform', function(d, i) {
                return 'translate(0, ' + (i * 20) + ')';
            })
            .call(drawBoundingRect, new Rect(0, 0, 20, 20))
            .call(drawRhythms);
    }

    function Rect(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
    }

    function drawBoundingRect(selection, rect) {
        selection.append('rect')
            .attr('x', rect.x)
            .attr('y', rect.y)
            .attr('width', rect.w)
            .attr('height', rect.h)
            .attr('stroke', 'black')
            .attr('fill', 'none');
    }

    function drawRhythms(selection) {
        selection
            .selectAll('.rhythm')
            .data(function(d) {
                return d;
            })
            .enter()
            .append('g')
            .attr('class', 'rhythm')
            .call(drawRhythm);
    }

    function drawRhythm(selection) {
        selection
            .attr('transform', function(d, i) {
                return 'translate(' + (i * 50) + ',0)';
            });

        selection.append('text')
            .style('font-size', 12)
            .style('font-family', 'Bravura')
            .attr('dy', '1em')
            .call(constructTextElement);

        selection.each(function(d, i) {
            d3.select(this).call(drawBoundingRect, new Rect(0, 5, 10, 10));
        });
    }

    function constructTextElement(selection) {
        selection.selectAll('tspan')
            .data(function(d) {
                return rhythms[d].split(',');
            })
            .enter()
            .append('tspan')
            .text(function(d) {
                return stemmed[d];
            })
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

    return part;
}());
