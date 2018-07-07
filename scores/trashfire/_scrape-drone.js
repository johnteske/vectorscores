TrashFire.scrapeDrone = (function(tf) {
    var drone = {};

    var width = tf.view.width * 0.75;

    var selection = tf.wrapper.append('path')
        .attr('transform', 'translate(' + ((tf.view.width * 0.5) - (width * 0.5)) + ',' + 350 + ')')
        .style('opacity', 0)
        .attr('fill', 'none')
        .attr('stroke', '#444')
        .attr('d', function() {
            return lineGenerator(makePath());
        });

    function makePath() {
        var points = 232;
        var slice = width / (points + 1);
        var height = 3;

        return buildArray(points, function(i) {
            return [
                i * slice,
                (height * 0.5) + (Math.random() * height)
            ];
        });
    }

    drone.show = function(t) {
        var dur = typeof t === 'undefined' ? 7000 : t;
        selection
            .attr('stroke-width', 0)
            .transition().duration(dur)
            .attr('stroke-width', 5)
            .style('opacity', 1);
    };

    drone.hide = function(t) {
        var dur = typeof t === 'undefined' ? 7000 : t;
        selection
            .transition().duration(dur)
            .attr('stroke-width', 0)
            .style('opacity', 0);
    };

    return drone;
})(TrashFire);
