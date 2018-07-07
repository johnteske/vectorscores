/**
 * Draw front and back groups so objects can emerge between the layers
 */

TrashFire.trashOrigin = {
    x: TrashFire.dumpster.width * 0.5,
    y: TrashFire.dumpster.height * 0.5
};

var dumpster = TrashFire.wrapper.append('g')
    .attr('transform', translateDumpsterWithYOffset(0));

dumpster.call(addDumpsterLayer, 'back');
var trashContainer = dumpster.append('g');
dumpster.call(addDumpsterLayer, 'front');

function dumpsterShake() {
    dumpster
        .transition()
        .duration(300)
        .ease(d3.easeElastic)
        .attr('transform', translateDumpsterWithYOffset(10))
        .transition()
        .duration(300)
        .ease(d3.easeBounce)
        .attr('transform', translateDumpsterWithYOffset(0));
}

function translateDumpsterWithYOffset(yOffset) {
    return function() {
        return 'translate(' +
            ((TrashFire.view.width - TrashFire.dumpster.width) * 0.5) + ', ' +
            (TrashFire.dumpster.y + yOffset) + ')';
    };
}

function addDumpsterLayer(selection, layer) {
    selection.append('g').append('use').attr('xlink:href', 'dumpster.svg#' + layer);
 }
