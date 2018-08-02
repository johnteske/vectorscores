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

// TODO rename function to reflect it updates the symbols not the instructions
function updateText(dur, index) {
    topo.selectAll('text').call(update, dur, index);
}
