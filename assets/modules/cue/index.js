---
---
// Remove existing SVG
d3.select('svg').remove();

function createTestCue(id) {
    var width = 120;
    var height = 120;

    var svg = d3.select('#' + id)
        .insert('svg', 'button')
        .attr('width', width)
        .attr('height', height)
        .style('border', '1px solid #888');

    var g = svg.append('g')
        .attr('transform', 'translate(' + (width * 0.5) + ', ' + (height * 0.5) + ')');

    g.append('text').text('\ue894')
        .attr('text-anchor', 'middle')
        .attr('dy', '-1em')
        .style('fill', '#444')
        .style('font-family', 'Bravura');

    return g.append('path')
        .attr('class', 'indicator')
        .attr('d', 'M-6.928,0 L0,2 6.928,0 0,12 Z')
        .style('stroke', 'black')
        .style('stroke-width', '1')
        .style('fill', 'black');
}

var indicator = createTestCue('cue-1');

var cue1 = VS.cueBlink(indicator)
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
        selection.style('fill-opacity', 1);
    });

d3.select('#cue-1 button').on('click', cue1.start);
