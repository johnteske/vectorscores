VS.factories = VS.factories || {};

VS.factories.pitch = function() {
    var _pitchClass = VS.factories.pitchClass();

    // In scientific pitch notation
    var octave = 4;

    // var frequency = ;
    // var midi = 60;

    function pitch() {}

    pitch.noteName = function(_) {
        if (arguments.length) {
            _pitchClass.noteName(_);
            return pitch;
        } else {
            return _pitchClass.noteName();
        }
    }

    pitch.number = function(_) {
        if (arguments.length) {
            _pitchClass.number(_);
            return pitch;
        } else {
            return _pitchClass.number();
        }
    }

    // pitch.transpose = _pitchClass.transpose;

    pitch.octave = function(_) {
        if (arguments.length) {
            octave = +_;
            // TODO change frequency
            // TODO change MIDI
            return pitch;
        } else {
            return octave;
        }
    };

    // TODO get and set by scientific pitch notation?
    // pitch.spn = function(_)

    return pitch;
}
