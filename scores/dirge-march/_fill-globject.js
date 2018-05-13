var pattern = svg.append('defs')
    .append('pattern')
    .attr('id', 'ascending-fill')
    .attr('width', 2)
    .attr('height', 2)
    .attr('patternUnits', 'userSpaceOnUse');

pattern.append('circle')
    .attr('fill', '#eee')
    .attr('r', 1);

function fillGlobject(d) {
    var bar = d;
    var phraseType = bar.phraseType;
    var duration = bar.duration;
    var width = duration * timeScale;

    var content = d3.select(this).select('.globject-content');

    if (phraseType === 'ascending') {
        content.append('rect')
            .attr('width', width)
            .attr('height', globjectHeight + 10)
            .attr('fill', 'url(#ascending-fill)');
    }

    var lineCloud = VS.lineCloud()
        .duration(duration)
        // TODO shape over time for each PC set, not by last set
        .phrase(makePhrase(phraseType, bar.pitch[bar.pitch.length - 1].classes))
        .transposition('octave')
        .curve(d3.curveCardinal)
        .width(width)
        .height(globjectHeight);

    content.call(lineCloud, { n: Math.floor(duration) });

    content.selectAll('.line-cloud-path')
        .attr('stroke', 'grey')
        .attr('stroke-dasharray', phraseType === 'ascending' ? '1' : 'none')
        .attr('fill', 'none');
}
