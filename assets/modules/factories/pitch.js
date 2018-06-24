VS.factories = VS.factories || {};

VS.factories.pitch = function() {
    var _pitchClass = VS.factories.pitchClass();

    // In scientific pitch notation
    var octave = 4;

    function pitch() {}

    pitch.noteName = function(_) {
        if (arguments.length) {
            _pitchClass.noteName(_);
            return pitch;
        } else {
            return _pitchClass.noteName();
        }
    };

    pitch.number = function(_) {
        if (arguments.length) {
            _pitchClass.number(_);
            return pitch;
        } else {
            return _pitchClass.number();
        }
    };

    pitch.octave = function(_) {
        if (arguments.length) {
            octave = +_;
            return pitch;
        } else {
            return octave;
        }
    };

    return pitch;
}
