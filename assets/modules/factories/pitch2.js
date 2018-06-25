/**
 * TODO do note names and octaves, etc need to be stored?
 * or are only number stored and display names are calculated?
 */
VS.factories = VS.factories || {};

// Adds pitch class functionality to an object (mutates)
function hasPitchClass(obj) {
    var _noteNameMap = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

    // TODO rename integer? (currently only supports integers, not microtones)
    var number = 0;

    // TODO rename letter?
    obj.noteName = function(_) {
        if (arguments.length) {
            number = _noteNameMap.indexOf(_);
            return obj;
        } else {
            return _noteNameMap[number];
        }
    }

    obj.number = function(_) {
        if (arguments.length) {
            number = +_;
            return obj;
        } else {
            return number;
        }
    };
}

function transpose(pitchClass, semitones) {
    return VS.mod(+semitones + pitchClass, 12)
}

VS.factories.pitchClass2 = function() {

    function pitchClass() {}

    hasPitchClass(pitchClass);

    pitchClass.transpose = function(_) {
        if (arguments.length) {
            var number = this.number();
            this.number(transpose(number, _))
            // this.number(VS.mod(+_ + number, 12));
            return this;
        }
    };

    return pitchClass;
  };


VS.factories.pitch2 = function() {

    // Scientific pitch notation, C4
    // C0 = 0
    // "Octave-major order": precisePitch = (Scientific pitch notation octave) * (pitch class number)
    var precisePitch = 48;

    function pitch() {}

    hasPitchClass(pitch);

    // TODO set precisePitch after setting number (or noteName)

    pitch.pitch = function(_) {
        if (arguments.length) {
            precisePitch = +_;
            return this;
        } else {
            return precisePitch;
        }
    }

    pitch.transpose = function(_) {
        if (arguments.length) {
            precisePitch += +_;
            this.number(VS.mod(precisePitch, 12));
            return this;
        }
    }

    pitch.octave = function(_) {
        if (arguments.length) {
            // TODO set precisePitch by octave
            return this;
        } else {
            return (precisePitch / 12) >> 0;
        }
    };

    return pitch;
}
