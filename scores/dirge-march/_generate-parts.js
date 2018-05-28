function generatePartsFromRawScore(rawScoreData) {

    // Use randomly sorted arrays to select from with Array#pop to avoid duplicate selections
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

    function generatePitchedPart() {
        var contours = {
            descending: globjects.filter(function(g) {
                return g.contour === 'descending';
            }),
            ascending: globjects.filter(function(g) {
                return g.contour === 'ascending';
            }),
            all: [].concat(globjects, retrogradeGlobjects)
        };

        shuffle(contours.descending);
        shuffle(contours.all);

        return rawScoreData
        .filter(function(d) {
            return d.pitched;
        }).map(function(d) {
            var globject = [];

            if (d.pitched.globjectContour !== 'rest') {
                for (var i = 0; i < (d.pitched.globjectCount || 1); i++) {
                    globject.push(contours[d.pitched.globjectContour].pop());
                }
            }

            return {
                index: d.index,
                time: d.time,
                duration: d.pitched.duration,
                dynamics: d.pitched.dynamics,
                phraseType: d.pitched.phraseType,
                pitch: d.pitched.pitch,
                globjects: globject
            };
        });
    }

    function generatePercussionPart() {

        var percussionBars = rawScoreData.filter(function(d) {
            return d.percussion.tempo !== null;
        });

        percussionBars = percussionBars.map(function(d) {
            d.percussion.rhythmIndices = [];

            for (var i = 0; i < config.numberOfPercussionParts; i++) {
                d.percussion.rhythmIndices.push(getRhythmIndices(d.percussion.rhythmRange));
            }

            return d;
        });

        deduplicateAdjacentDynamics(percussionBars);

        return percussionBars;
    }

    function getRhythmIndices(extent) {
        var availableIndices = [];

        for (var i = extent[0]; i <= extent[1]; i++) {
            availableIndices.push(i);
        }

        shuffle(availableIndices);

        var selectedIndices = [];
        var rhythmsPerBar = Math.min(availableIndices.length, config.maxRhythmsPerBar);

        for (var j = 0; j < rhythmsPerBar; j++) {
            selectedIndices.push(availableIndices.pop());
        }

        return selectedIndices;
    }

    function deduplicateAdjacentDynamics(bars) {
        for (var i = 0; i < bars.length - 1; i++) {
            var bar = bars[i];
            var barDynamics = bar.percussion.dynamics;
            var lastDynamic = barDynamics[barDynamics.length - 1].value;

            var nextBar = bars[i + 1];
            var nextDynamic = nextBar.percussion.dynamics[0].value;

            if ((lastDynamic === nextDynamic) && (bar.time + bar.percussion.duration === nextBar.time)) {
                bar.percussion.dynamics.pop();
            }
        }
    }

    return {
        pitched: generatePitchedPart(),
        percussion: generatePercussionPart()
    };
}
