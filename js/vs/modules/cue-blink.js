VS.cueBlink = function(selection, args) {
    var _selection = selection;
    var beats = args && args.beats ? +args.beats : 1;
    var interval = args && args.interval ? +args.interval : 1000;
    var durationOn = 50;
    var durationOff = 700;

    /**
     * Default on, off, end states
     */
    var setOn = function(selection) {
        selection.style('opacity', 1);
    };

    var setOff = function(selection) {
        selection.style('opacity', 0.25);
    };

    var setEnd = function(selection) {
        selection.style('opacity', 1);
    };

    function blink(selection, delay, isLast) {
        _selection.transition().delay(delay).duration(durationOn)
            .call(setOn)
            .transition().delay(durationOn).duration(durationOff)
            .call(isLast ? setEnd : setOff);
    }

    function cueBlink() {}

    cueBlink.duration = VS.constant(beats * interval);

    cueBlink.start = function() {
        for (var i = 0; i < (beats + 1); i++) {
            _selection.call(blink, i * interval, i === beats);
        }
    };

    cueBlink.cancel = function() {
        _selection
            .interrupt()
            .call(setEnd);
    };

    cueBlink.on = function(_) {
        return (arguments.length && typeof _ === 'function') ? (setOn = _, cueBlink) : setOn;
    };

    cueBlink.off = function(_) {
        return (arguments.length && typeof _ === 'function') ? (setOff = _, cueBlink) : setOff;
    };

    cueBlink.end = function(_) {
        return (arguments.length && typeof _ === 'function') ? (setEnd = _, cueBlink) : setEnd;
    };

    return cueBlink;
};
