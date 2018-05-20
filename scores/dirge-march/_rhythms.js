var rhythms = (function() {
    function flattenWithCommasBetween(array) {
        return array.reduce(function(a, b) {
            return a.concat(b, [',']);
        }, []).slice(0, -1);
    }

    return {
        strings: [
            // 2/4
            '1, ,1,-,-0.5',
            '1,-,-0.5, ,1',
            '1, ,1,-,-0.5,trip,-,-0.5',
            '1,-,-0.5,trip,-,-0.5, ,1',
            '1,=,=0.25,=,=0.25,=,=0.25, ,1',
            // 4/4
            '1, ,1, ,r0.5, ,0.5, ,1,-,-0.5',
            '1,-,-0.5, ,1, ,r0.5, ,0.5, ,1',
            '1, ,1, ,r0.5., ,0.25,1.,-,=0.25',
            '1, ,1,-,-0.5, ,1,=,=0.25,=,=0.25,=,=0.25, ,1,-,-0.5',
            '1, ,1.,-,=0.25, ,1,-,-0.5,trip,-,-0.5, ,1.,-,=0.25',
            '1,-,-0.5, ,1,-,-0.5,=,=0.25, ,1,=,=0.25,-,-0.5, ,1,-,-0.5'
        ],
        // Bravura: beamed groups of notes (U+E220–U+E23F), only long stem glyphs selected
        // TODO standardize and integrate in Bravura dictionary
        stringToBravuraMap: {
            ' ': ' ',
            '.': '\ue1e7', // dot
            '-': '\ue1f8', // beam, single
            '=': '\ue1fa', // beam, double
            '0.25': '\ue1d9', // sixteenth, with flag
            '=0.25': '\ue1f5', // sixteenth, leading beam
            '0.5': '\ue1d7', // eighth, with flag
            '-0.5': '\ue1f3', // eighth, leading beam
            '1': '\ue1f1', // quarter
            '1.': '\ue1f1\u2002\ue1e7', // dotted quarter (en space)
            // "[": "\ue201",
            'trip': '\ue202',
            // "]": "\ue203"
            'r0.5': '\ue4e6',
            'r0.5.': '\ue4e6\ue1e7'
        },
        // Display as unordered set, with brackets and comma-separated
        getTextFragmentsFromIndices: function(indices) {
            var rhythmStringFragments = indices.map(function(index) {
                return rhythms.strings[index].split(',');
            });

            return [].concat('{', flattenWithCommasBetween(rhythmStringFragments), '}');
        }
    };
}());
