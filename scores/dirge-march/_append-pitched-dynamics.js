function appendPitchedDynamics(selection) {

    selection.append('g')
        .attr('transform', 'translate(0,' + globjectHeight + ')')
        .selectAll('.dynamic')
        .data(function(d) {
            return d.dynamics.map(function(dynamic) {
                dynamic.width = d.duration * timeScale;
                return dynamic;
            });
        })
        .enter()
        .append('text')
        .attr('class', 'dynamic')
            .attr('x', function(d, i) {
                return d.width * d.time;
            })
            .attr('dy', '1em')
            .attr('text-anchor', function(d) {
                return textAnchor(d.time);
            })
            .text(function(d) {
                return dynamics[d.value];
            });
}
