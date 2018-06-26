VS.factories = VS.factories || {};

(function() {

    function makeGetterSetter(getter, setter) {
        return function(_) {
            return arguments.length ? (setter(_), this) : getter();
        };
    }

    function makeConditionalSetter(setter) {
        return function(_) {
            arguments.length && setter(_);
            return this;
        };
    }

    // Adds pitch class functionality to an object (mutates)
    function hasPitchClass(obj) {

        // TODO rename integer? (currently only supports integers, not microtones)
        var number = 0;

        obj.number = makeGetterSetter(
            function() { return number; },
            function(_) { number = +_; }
        );

        var _noteNameMap = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

        // TODO rename to 'letter'?
        obj.noteName = makeGetterSetter(
            function() { return _noteNameMap[number]; },
            function(_) { number = _noteNameMap.indexOf(_); }
        );

        return obj;
    }

    function transpose(pitchClass, semitones) {
        return VS.mod(+semitones + pitchClass, 12);
    }

    VS.factories.pitchClass = function() {

        var pitchClass = hasPitchClass(function() {});

        pitchClass.transpose = makeConditionalSetter(function(_) {
            var current = pitchClass.number();
            pitchClass.number(transpose(current, _));
        });

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

        function pitchClassDecorator(fn) {
            return makeGetterSetter(
                fn,
                function(_) {
                    fn(_);
                    setPitchWithinOctave();
                }
            );
        }

        function setPitchWithinOctave() {
            precisePitch = (obj.octave() * 12) + obj.number();
        }

        obj.pitch = makeGetterSetter(
            function() { return precisePitch; },
            function(_) { precisePitch = +_; }
        );

        obj.transpose = makeConditionalSetter(function(_) {
            precisePitch += +_;
            _pitchClass.number(VS.mod(precisePitch, 12));
        });

        obj.octave = makeGetterSetter(
            function() { return (precisePitch / 12) >> 0; },
            function(_) { precisePitch = (+_ * 12) + _pitchClass.number(); }
        );

        return obj;
    }

    VS.factories.pitch = function() {
        return hasPitch(function() {});
    };

    VS.factories.note = function() {

        var duration = 1; // TODO create hasDuration, to include duration scaling, etc.

        var note = hasPitch(function() {});

        note.duration = makeGetterSetter(
            function() { return duration; },
            function(_) { duration = +_; }
        );

        return note;
    };

})();
