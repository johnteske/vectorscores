TrashFire.spike = (function() {
    var spike = {};

    var x = TrashFire.view.width * 0.5;

    spike.group = TrashFire.wrapper.append('g')
        .attr('class', 'spike')
        .style('opacity', 0);

    spike.group.append('path')
        .attr('d', 'M-15,0 L15,0 L0,60 Z');

    spike.show = function() {
        spike.group
            .attr('transform', 'translate(' + x + ','  + 15 + ')')
            .style('opacity', 0)
            .transition().duration(600)
            .style('opacity', 1);
    };

    spike.hit = function() {
        trash.empty();
        trash.update(300);

        d3.select('.spike')
            .transition().duration(600).ease(d3.easeElastic)
            .attr('transform', 'translate(' + x + ','  + (TrashFire.dumpster.y - 45) + ')')
            .transition().duration(150).ease(d3.easeLinear)
            .style('opacity', 0);

        dumpster.shake();
    };

    return spike;
})();
