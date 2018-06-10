function appendDynamics(selection) {
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
