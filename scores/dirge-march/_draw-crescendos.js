function drawCrescendos(selection, width) {
    var linePadding = 10;
    var y = 20;
    var height = 10;
    var halfHeight = height * 0.5;
    var lineWidthThreshold = 120;

    var line = d3.line()
        .x(function(d) { return d[0]; })
        .y(function(d) { return d[1]; });

    selection
        .filter(function(d) {
            return d.x2 - d.x1 < lineWidthThreshold;
        })
        .append('path')
        .attr('transform', 'translate(0,' + y + ')')
        .attr('d', function(d) {
            var x1 = (d.x1 === 0) ? d.x1 : d.x1 + linePadding;
            var x2 = (d.x2 === width) ? d.x2 : d.x2 - linePadding;
            var hairpinStart;
            var hairpinEnd;

            if (d.value === '<') {
                hairpinStart = x1;
                hairpinEnd = x2;
            } else {
                hairpinStart = x2;
                hairpinEnd = x1;
            }

            var points = [
                [hairpinEnd, halfHeight],
                [hairpinStart, 0],
                [hairpinEnd, -halfHeight]
            ];

            return line(points);
        })
        .attr('stroke', '#222222')
        .attr('fill', 'none');

    selection
        .filter(function(d) {
            return d.x2 - d.x1 > lineWidthThreshold;
        })
        .append('text')
        // .attr('class', 'dynamic text')
        .attr('x', function(d) {
            return layout.scaleTime(d.time * d.duration);
        })
        .attr('y', y)
        .attr('dy', '0.3em')
        .text(function(d) {
            if (d.value === '<') {
                return 'cres.';
            } else {
                return 'dim.';
            }
        })
        .attr('text-anchor', 'middle')
        .style('font-family', 'serif')
        .style('font-size', 15)
        .style('font-style', 'italic');
}
