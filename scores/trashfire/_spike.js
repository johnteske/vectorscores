TrashFire.spike = (function(tf) {
    var spike = {};

    var x = tf.view.width * 0.5;

    var path = tf.wrapper
        .append('path')
        .attr('d', 'M-15,0 L15,0 L0,60 Z')
        .style('opacity', 0);

    spike.show = function(t, trashes) {
        trash.set(0, trashes);

        path
            .attr('transform', translateY(15))
            .style('opacity', 0)
            .transition().duration(t)
            .style('opacity', 1);
    };

    spike.hit = function(t, trashes) {
        trash.set(t * 0.4, trashes);

        path
            .transition().duration(t * 0.8).ease(d3.easeElastic)
            .attr('transform', translateY(tf.dumpster.y - 45))
            .transition().duration(t * 0.2).ease(d3.easeLinear)
            .style('opacity', 0);

        dumpster.shake();
    };

    // Used for step control hook only
    spike.hide = function() {
        path.style('opacity', 0);
    };

    function translateY(y) {
        return function() {
            return 'translate(' + x + ', ' + y + ')';
        };
    }

    return spike;
})(TrashFire);
