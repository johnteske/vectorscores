// ---
// layout: compress-js
// ---
VS.factories = VS.factories || {};

VS.factories.pitchClass = function() {

    // var noteNameMap = {
    //     'c': 0
    // }
    var noteNameMap = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

    var noteName = 'c';
    var number = 0;

    function pitchClass() {}

    pitchClass.noteName = function(_) {
        if (arguments.length) {
            noteName = _;
            number = noteNameMap.indexOf(noteName);
            return pitchClass;
        } else {
            return noteName;
        }
    };

    pitchClass.number = function(_) {
        if (arguments.length) {
            number = +_;
            noteName = noteNameMap[number];
            return pitchClass;
        } else {
            return number;
        }
    };

    pitchClass.transpose = function(_) {
        if (arguments.length) {
            number = VS.mod(+_ + number, 12);
            noteName = noteNameMap[number];
            return pitchClass;
        }
    };

    return pitchClass;
  };
