/**
 * TODO do note names and octaves, etc need to be stored?
 * or are only number stored and display names are calculated?
 */
VS.factories = VS.factories || {};

(function() {
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

    VS.factories.pitchClass3 = function() {

        function pitchClass() {}

        hasPitchClass(pitchClass);

        pitchClass.transpose = function(_) {
            if (arguments.length) {
                var number = this.number();
                this.number(transpose(number, _))
                return this;
            }
        };

        return pitchClass;
    };

    VS.factories.pitch3 = function() {

        function _pitchClass() {}
        hasPitchClass(_pitchClass);

        // Scientific pitch notation, C4
        // "Octave-major order": precisePitch = (Scientific pitch notation octave * 12) + (pitch class number)
        // C0 = 0
        var precisePitch = 48;

        function pitch() {}

        pitch.noteName = function(_) {
            if (arguments.length) {
                _pitchClass.noteName(_);
                setPitchWithinOctave();
                return this;
            } else {
                return _pitchClass.noteName();
            }
        }

        pitch.number = function(_) {
            if (arguments.length) {
                _pitchClass.number(_);
                setPitchWithinOctave();
                return this;
            } else {
                return _pitchClass.number();
            }
        };

        function setPitchWithinOctave() {
            precisePitch = (pitch.octave() * 12) + pitch.number();
        }

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
                _pitchClass.number(VS.mod(precisePitch, 12));
                return this;
            }
        }

        pitch.octave = function(_) {
            if (arguments.length) {
                precisePitch = (+_ * 12) + _pitchClass.number()
                return this;
            } else {
                return (precisePitch / 12) >> 0;
            }
        };

        return pitch;
    }

})();
