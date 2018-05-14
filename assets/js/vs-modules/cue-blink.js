---
layout: compress-js
---
VS.cueBlink = function(selection, args) {
    var _selection = selection;
    var beats = args && args.beats ? +args.beats : 1;
    var interval = args && args.interval ? +args.interval : 1000; // period, T
    var onDuration = 50;
    var offDuration = 700;

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
        _selection.transition().delay(delay).duration(onDuration)
            .call(setOn)
            .transition().delay(onDuration).duration(offDuration)
            .call(isLast ? setEnd : setOff);
    }

    function cueBlink() {}

    cueBlink.duration = function() {
        return beats * interval;
    };

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

    cueBlink.beats = function(_) {
        return arguments.length ? (beats = +_, cueBlink) : beats;
    };

    cueBlink.onDuration = function(_) {
        return arguments.length ? (onDuration = +_, cueBlink) : onDuration;
    };

    cueBlink.offDuration = function(_) {
        return arguments.length ? (offDuration = +_, cueBlink) : offDuration;
    };

    cueBlink.interval = function(_) {
        return arguments.length ? (interval = +_, cueBlink) : interval;
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
