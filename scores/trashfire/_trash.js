/**
 * Generate trash
 */
var trash = (function() {
    var trash = {};

    var _trash = [];

    trash.add = function(t) {
        _trash.push(t);
    };

    trash.empty = function() {
        _trash = [];
    };

    trash.remove = function() {
        _trash.pop();
    };

    trash.update = function(duration) {
        var dur = duration || 1000;
        var offset = 10;
        var trashWidths = _trash.map(function(t) {
            return t.size;
        });
        var trashWidthSum = trashWidths.reduce(function(a, b) {
            return a + b;
        }, (trashWidths.length - 1) * offset);

        function trashPosition(d, i) {
            var upToI = trashWidths.slice(0, i),
                sum = upToI.reduce(function(a, b) {
                    return a + b;
                }, 0),
                x = (TrashFire.trashOrigin.x - (trashWidthSum * 0.5)) +
                    (sum + (i * offset)),
                y = d.size * -0.5 - 50;
            return 'translate(' + x + ',' + y + ')';
        }

        var trashSelection = trashContainer.selectAll('.trash')
            .data(_trash);

        // EXIT
        trashSelection.exit()
            .transition().duration(dur)
            .attr('transform', function() {
                return 'translate(' + TrashFire.trashOrigin.x + ',' + TrashFire.trashOrigin.y + ')';
            })
            .style('opacity', 0)
            .remove();

        // UPDATE
        trashSelection
            .transition().duration(dur)
            .attr('transform', trashPosition);

        // ENTER
        trashSelection.enter()
            .append('g').attr('class', 'trash')
                .attr('transform', function() {
                    return 'translate(' + TrashFire.trashOrigin.x + ',' + TrashFire.trashOrigin.y + ')';
                })
                .call(makePath)
                .transition().duration(dur)
                .attr('transform', trashPosition);
    };

    return trash;
})();

var lineGenerator = d3.line()
    .x(function(d) { return d[0]; })
    .y(function(d) { return d[1]; });
    // .interpolate("basis");

function makePath(selection) {
    selection.each(function(d) {
        var nPoints = 60,
            margin = 10,
            slice = (d.size - (margin * 2)) / (nPoints + 1),
            height;

        if (d.type === 'blaze') {
            height = d.size * 0.67;
        } else {
            height = 3;
        }

        d.pathPoints = [];

        var j;

        if (d.type !== 'embers') {
            for (j = 0; j < nPoints; j++) {
                d.pathPoints.push([
                    margin + (j * slice),
                    (d.size * 0.5 - (height * 0.5)) + (Math.random() * height)
                ]);
            }
        } else {
            for (j = 0; j < nPoints; j++) {
                d.pathPoints.push([
                    margin + (j * slice),
                    d.size - margin - (j * slice) + (Math.random() * height)
                ]);
            }
        }
    });

    selection.append('path')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', function(d) { return d.type !== 'embers' ? 2 : 1; })
        .style('opacity', function(d) {
            return d.type === 'blaze' || d.type === 'scrape' ? 1 : 0.5;
        })
        .attr('d', function(d) {
            return lineGenerator(d.pathPoints);
        });
}
