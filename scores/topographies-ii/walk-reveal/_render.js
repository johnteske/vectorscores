// Initial render

/**
 * Render score directly from row-major order data
 */
topo.selectAll('text')
    .data(topoData) // TODO this will become walkEvents[0]
    .enter()
    .append('text')
    .attr('x', function(d, i) {
        var c = indexToPoint(i);
        return (c.x - c.y) * tileWidthHalf;
    })
    .each(function(d) {
        var symbolIndex = ~~d.height + 4;
        var symbolKey = getStringByIndex(symbolIndex);
        var offsets = symbolSet.offsets[symbolKey];

        d3.select(this).text(symbolSet.strings[symbolKey])
            .attr('dx', offsets.x + 'em')
            .attr('dy', offsets.y + 'em');
    })
    .call(revealSymbols, 0);

function getStringByIndex(index) {
    if (index > (symbolSet.scale.length - 1)) {
        return 'max';
    } else if (index < 0) {
        return 'min';
    } else {
        return symbolSet.scale[index];
    }
}
