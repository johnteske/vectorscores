function generatePartsFromRawScore(rawScoreData) {

    function generatePitchedPart() {
        function getRandAndRemove(array) {
            var i = Math.floor(VS.getRandExcl(0, array.length));
            return array.splice(i, 1);
        }

        var contours = {
            descending: globjects.filter(function(g) {
                return g.contour === 'descending';
            }),
            rest: [],
            ascending: globjects.filter(function(g) {
                return g.contour === 'ascending';
            }),
            all: retrogradeGlobjects // globjects.concat(retrogradeGlobjects) // TODO WHHYYYY
        };

        return rawScoreData.filter(function(d) {
            return d.pitched;
        }).map(function(d) {
            var globject = [];

            if (d.pitched.globjectContour !== 'all') {
                globject = getRandAndRemove(contours[d.pitched.globjectContour]);
            } else {
                for (var i = 0; i < (d.pitched.globjectCount || 1); i++) {
                    globject.push(VS.getItem(contours[d.pitched.globjectContour]));
                }
            }

            return {
                time: d.time,
                duration: d.pitched.duration,
                dynamics: d.pitched.dynamics,
                phraseType: d.pitched.phraseType,
                pitch: d.pitched.pitch,
                globjects: globject
            };
        });
    }

    var nParts = 2; // TODO
    var maxRhythms = 2; // TODO

    function generatePercussionPart() {

        return rawScoreData.filter(function(d) {
            return d.percussion.tempo !== null;
        })
        .map(function(d) {
            d.percussion.rhythmIndices = [];

            for (var i = 0; i < nParts; i++) {
                d.percussion.rhythmIndices.push(getRhythmIndices(d.percussion.rhythmRange));
            }

            return d;
        });
    }

    function getRhythmIndices(extent) {
        var availableIndices = [];

        for (var i = extent[0]; i <= extent[1]; i++) {
            availableIndices.push(i);
        }

        shuffle(availableIndices);

        var selectedIndices = [];
        var n = Math.min(availableIndices.length, maxRhythms);

        for (var j = 0; j < n; j++) {
            selectedIndices.push(availableIndices.pop());
        }

        return selectedIndices;
    }

    // Use randomly sorted arrays to select from with Array#pop to avoid duplicate selections
    // TODO use for the pitched globject selection as well
    // https://www.frankmitchell.org/2015/01/fisher-yates/
    function shuffle(array) {
        var i = 0;
        var j = 0;
        var temp = null;

        for (i = array.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    return {
        pitched: generatePitchedPart(),
        percussion: generatePercussionPart()
    };
}
