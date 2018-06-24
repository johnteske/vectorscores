/**
 * TODO do note names and octaves, etc need to be stored?
 * or are only number stored and display names are calculated?
 */
VS.factories = VS.factories || {};

// Adds pitch class functionality to an object (mutates)
function hasPitchClass(obj) {
    var _noteNameMap = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

    // TODO rename letter?
    var noteName = 'c';
    // TODO rename integer? (currently only supports integers, not microtones)
    var number = 0;

    obj.noteName = function(_) {
        if (arguments.length) {
            noteName = _;
            number = _noteNameMap.indexOf(noteName);
            return obj;
        } else {
            return noteName;
        }
    }

    obj.number = function(_) {
        if (arguments.length) {
            number = +_;
            noteName = _noteNameMap[number];
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

    // In scientific pitch notation
    var octave = 4;

    // These could start as get-only methods
    // var frequency
    // var midi = 60;
    // var spn
    // var precisePitch = 0; // TODO since MIDI middle C can be C3 or C4, use own numeric pitch system?

    function pitch() {}

    hasPitchClass(pitch);

    pitch.transpose = function(_) {
        if (arguments.length) {
            var number = this.number();
            this.number(transpose(number, _))
            // this.number(VS.mod(+_ + number, 12));

            octave += octaveDifference(+_);

            return this;
        }
    }

    function octaveDifference(_){
        return (_ / 12) >> 0;
    }

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
