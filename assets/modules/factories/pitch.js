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
        };

        obj.number = function(_) {
            if (arguments.length) {
                number = +_;
                return obj;
            } else {
                return number;
            }
        };

        return obj;
    }

    function transpose(pitchClass, semitones) {
        return VS.mod(+semitones + pitchClass, 12);
    }

    VS.factories.pitchClass = function() {

        var pitchClass = hasPitchClass(function() {});

        pitchClass.transpose = function(_) {
            if (arguments.length) {
                var number = this.number();
                this.number(transpose(number, _));
                return this;
            }
        };

        return pitchClass;
    };

    function hasPitch(obj) {

        var _pitchClass = hasPitchClass(function() {});

        // Scientific pitch notation, C4
        // "Octave-major order": precisePitch = (Scientific pitch notation octave * 12) + (pitch class number)
        // C0 = 0
        var precisePitch = 48;

        obj.noteName = pitchClassDecorator(_pitchClass.noteName);
        obj.number = pitchClassDecorator(_pitchClass.number);

        // or is it a wrapper?
        function pitchClassDecorator(fn) {
            return function(_) {
                if (arguments.length) {
                    fn(_);
                    setPitchWithinOctave();
                    return this;
                } else {
                    return fn();
                }
            };
        }

        function setPitchWithinOctave() {
            precisePitch = (obj.octave() * 12) + obj.number();
        }

        obj.pitch = function(_) {
            if (arguments.length) {
                precisePitch = +_;
                return this;
            } else {
                return precisePitch;
            }
        };

        obj.transpose = function(_) {
            if (arguments.length) {
                precisePitch += +_;
                _pitchClass.number(VS.mod(precisePitch, 12));
                return this;
            }
        };

        obj.octave = function(_) {
            if (arguments.length) {
                precisePitch = (+_ * 12) + _pitchClass.number();
                return this;
            } else {
                return (precisePitch / 12) >> 0;
            }
        };

        return obj;
    }

    VS.factories.pitch = function() {
        return hasPitch(function() {});
    };

    VS.factories.note = function() {

        var duration = 1; // TODO create hasDuration, to include duration scaling, etc.

        var note = hasPitch(function() {});

        note.duration = function(_) {
            if (arguments.length) {
                duration = +_;
                return this;
            } else {
                return duration;
            }
        };

        return note;
    };

})();
