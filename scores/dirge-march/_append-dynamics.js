function appendDynamics(selection, data, y) {
    selection
        .append('g')
        .attr('transform', 'translate(0,' + y + ')')
        .selectAll('.dynamic')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'dynamic')
            .attr('x', function(d, i) {
                return layout.scaleTime(d.duration * d.time);
            })
            .attr('dy', '1em')
            .attr('text-anchor', function(d) {
                return textAnchor(d.time);
            })
            .text(function(d) {
                return dynamics[d.value];
            });
}

function appendDynamics2(selection) {
    selection
        .append('text')
        .attr('class', 'dynamic')
            .attr('x', function(d) {
                // console.log(d);
                return layout.scaleTime(d.duration * d.time);
            })
            .attr('dy', '1em')
            .attr('text-anchor', function(d) {
                return textAnchor(d.time);
            })
            .text(function(d) {
                return dynamics[d.value];
            });
}
