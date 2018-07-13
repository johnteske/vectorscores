TrashFire.spike = (function(tf) {
    var spike = {};

    var x = tf.view.width * 0.5;

    var path = tf.wrapper
        .append('path')
        .attr('d', 'M-15,0 L15,0 L0,60 Z')
        .style('opacity', 0);

    spike.show = function() {
        path
            .attr('transform', translateY(15))
            .style('opacity', 0)
            .transition().duration(600)
            .style('opacity', 1);
    };

    spike.hit = function(trashes) {
        trash.set(trashes); // TODO // 300ms

        path
            .transition().duration(600).ease(d3.easeElastic)
            .attr('transform', translateY(tf.dumpster.y - 45))
            .transition().duration(150).ease(d3.easeLinear)
            .style('opacity', 0);

        dumpster.shake();
    };

    function translateY(y) {
        return function() {
            return 'translate(' + x + ', ' + y + ')';
        };
    }

    return spike;
})(TrashFire);
