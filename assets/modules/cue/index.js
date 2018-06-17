window.addEventListener('load', function() {
    var width = 240;
    var height = 240;

    var svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height)
        .style('border', '1px solid red');

    var g = svg.append('g')
        .attr('transform', 'translate(120, 120)');

    var indicator = g.append('path')
        // .attr('transform', 'translate(120, 120)')
        .attr('class', 'indicator')
        .attr('d', 'M-6.928,0 L0,2 6.928,0 0,12 Z')
        .style('stroke', 'black')
        .style('stroke-width', '1')
        .style('fill', 'black')
        .style('fill-opacity', '0');

    var cueBlink = VS.cueBlink(indicator)
        .beats(2)
        .inactive(function(selection) {
            selection.style('fill-opacity', 0);
        })
        .on(function(selection) {
            selection.style('fill-opacity', 1);
        })
        .off(function(selection) {
            selection.style('fill-opacity', 0);
        })
        .down(function(selection) {
            selection
                .style('fill', 'red')
                .style('fill-opacity', 1);
        })
        // .interval(3000)
        // .onDuration(0)
        // .offDuration(1500)
        // .on(function(selection) {
        //     selection.attr('transform', 'scale(2)');
        // })
        // .off(function(selection) {
        //     selection.attr('transform', 'scale(1)');
        // })
        // .end(function(selection) {
        //     selection.attr('transform', 'scale(4)');
        // });

    VS.score.preroll = 1000;

    VS.score.add(0, cueBlink.start);

});
