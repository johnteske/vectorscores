function update(selection, dur, frameIndex) {
    selection
        .data(walkEvents[frameIndex].topography)
        .transition().duration(dur)
        .attr('y', function(d, i) {
            var c = indexToPoint(i);
            var hScale = d.revealed ? heightScale.revealed : heightScale.hidden

            var scaledHeight = d.height * hScale;

            return ((c.x + c.y) * tileHeightHalf) - scaledHeight;
        })
        .style('opacity', function(d) {
            return d.revealed / revealFactor;
        });
}

function updateSymbols(dur, index) {
    topo.selectAll('text').call(update, dur, index);
}
