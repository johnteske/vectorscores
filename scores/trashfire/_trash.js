/**
 * Generate trash
 */
var trash = (function(tf) {
    var trash = {};

    var xOffset = 10;
    var yOffset = -50;

    var _trash = [];

    trash.set = function(trashArray) {
        _trash = trashArray;
        update();
    };

    function update(duration) {
        var dur = duration || 1000;

        var trashWidths = _trash.map(function(t) {
            return t.size;
        });

        var xOffsets = (_trash.length - 1) * xOffset;
        var trashWidthSum = trashWidths.reduce(sum, xOffsets);
        // Leftmost trash position based on width of all trash (and offsets)
        var trashX = tf.trashOrigin.x - (trashWidthSum * 0.5);

        function trashPosition(d, i) {
            var currentSum = trashWidths.slice(0, i).reduce(sum, 0);
            var x = trashX + (currentSum + (i * xOffset));
            var y = (d.size * -0.5) + yOffset;
            return 'translate(' + x + ',' + y + ')';
        }

        var trashSelection = dumpster.trashGroup.selectAll('.trash')
            .data(_trash, function(d) {
                return d.id;
            });

        // EXIT
        trashSelection.exit()
            .transition().duration(dur)
            .attr('transform', translateTrashOrigin)
            .style('opacity', 0)
            .remove();

        // UPDATE
        trashSelection
            .transition().duration(dur)
            .attr('transform', trashPosition);

        // ENTER
        trashSelection.enter()
            .append('g').attr('class', 'trash')
                .attr('transform', translateTrashOrigin)
                .call(makePath)
                .transition().duration(dur)
                .attr('transform', trashPosition);
    }

    function translateTrashOrigin() {
        return 'translate(' + tf.trashOrigin.x + ',' + tf.trashOrigin.y + ')';
    }

    return trash;
})(TrashFire);

function makePath(selection) {
    selection.each(function(d) {
        var nPoints = 60;
        var margin = 10;
        var slice = (d.size - (margin * 2)) / (nPoints + 1);
        var height = (d.type === 'blaze') ? d.size * 0.67 : 3;

        d.pathPoints = buildArray(nPoints, d.type === 'embers' ? makeEmberPoint : makeFlamePoint);

        function makeFlamePoint(i) {
            return [
                margin + (i * slice),
                (d.size * 0.5 - (height * 0.5)) + (Math.random() * height)
            ];
        }

        function makeEmberPoint(i) {
            return [
                margin + (i * slice),
                d.size - margin - (i * slice) + (Math.random() * height)
            ];
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
