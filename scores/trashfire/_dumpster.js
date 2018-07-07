/**
 * Draw front and back groups so objects can emerge between the layers
 */
var dumpster = (function(tf) {
    var dumpster = {};

    var group = tf.wrapper.append('g')
        .attr('transform', translateDumpsterWithYOffset(0));

    group.call(addDumpsterLayer, 'back');

    dumpster.trashGroup = group.append('g');

    group.call(addDumpsterLayer, 'front');

    dumpster.shake = function() {
        group
            .transition()
                .duration(300)
                .ease(d3.easeElastic)
                .attr('transform', translateDumpsterWithYOffset(10))
            .transition()
                .duration(300)
                .ease(d3.easeBounce)
                .attr('transform', translateDumpsterWithYOffset(0));
    };

    function translateDumpsterWithYOffset(yOffset) {
        return function() {
            return 'translate(' +
                ((tf.view.width - tf.dumpster.width) * 0.5) + ', ' +
                (tf.dumpster.y + yOffset) + ')';
        };
    }

    function addDumpsterLayer(selection, layer) {
        selection.append('g').append('use').attr('xlink:href', 'dumpster.svg#' + layer);
    }

    return dumpster;
})(TrashFire);
