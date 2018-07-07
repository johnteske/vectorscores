/**
 * TODO make noise noisier, similar to trash/fire paths
 */
TrashFire.noiseLayer = (function(tf) {
    var noiseLayer = {};

    var group = tf.wrapper.append('g');
    var noiseElements;

    var n = 200; // fixed size, for now

    function x() {
        return (Math.random() * layout.main.width) - (layout.main.width * 0.25);
    }

    function y() {
        return Math.random() * layout.main.height;
    }

    function w() {
        return Math.random() * layout.main.width;
    }

    function h() {
        return Math.random() * 2;
    }

    noiseLayer.render = function() {
        noiseElements = group
            .selectAll('.noise')
            .data(d3.range(0, n))
            .enter()
            .append('rect')
                .attr('class', 'noise')
                .style('opacity', 0)
                .attr('fill', '#888888')
                .attr('x', x)
                .attr('y', y)
                .attr('width', w)
                .attr('height', h);
    };

    noiseLayer.add = delayedOpacityTransition(1);

    noiseLayer.remove = delayedOpacityTransition(0);

    function delayedOpacityTransition(opacity) {
        return function(delay) {
            noiseElements
                .transition().duration(0)
                .delay(function(d, i) { return i * delay; })
                .style('opacity', opacity);
        };
    }

    return noiseLayer;
})(TrashFire);
