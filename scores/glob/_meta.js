/**
 * Pitch class set
 */
var pitchClassSet = (function() {
    var selection = wrapper.append('text')
        .attr('class', 'pc-set')
        .attr('x', canvas.center)
        .attr('dy', '1em');

    function update(set) {
        var formatted = set.map(function(pc) {
            return VS.pitchClass.format(pc, scoreSettings.pcDisplay, scoreSettings.pcPreference);
        }).join(', ');

        selection.text(function() {
            return '{' + formatted + '}';
        });
    }

    return {
        update: update
    };
})();

/**
 * Dynamics
 */
var dynamics = (function() {
    var selection = wrapper.append('text')
        .attr('class', 'dynamics')
        .attr('x', canvas.center)
        .attr('y', canvas.height)
        .attr('dy', '-0.5em');

    function update(text) {
        selection.text(dynamicsDict[text]);
    }

    return {
        update: update
    };
})();
