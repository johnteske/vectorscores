function globjectText(d) {

    var selection = d3.select(this);
    var width = d.duration * timeScale; // d.width;

    /**
     * Pitch classes
     * TODO draw arrow transitioning to next bar, rename file and function
     */
    selection.append('g')
        .selectAll('.pitch-class')
        .data(d.pitch)
        .enter()
        .append('text')
        .attr('class', 'pitch-class')
        .attr('x', function(d) {
            return d.time * width;
        })
        .attr('dy', '-1.5em')
        .attr('text-anchor', function(d) {
            return textAnchor(d.time);
        })
        .text(function(d) {
            var set = VS.pitchClass.transpose(d.classes, transposeBy).map(function(pc) {
                return VS.pitchClass.format(pc, scoreSettings.pitchClasses.display, scoreSettings.pitchClasses.preference);
            });

            return '{' + set + '}';
        });
}
