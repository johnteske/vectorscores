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

        var pitchedBars = rawScoreData.filter(function(bar) {
            return bar.pitched;
        });

        pitchedBars = pitchedBars.map(function(bar) {
            var globject = [];

            if (bar.pitched.globjectContour !== 'rest') {
                for (var i = 0; i < (bar.pitched.globjectCount || 1); i++) {
                    globject.push(contours[bar.pitched.globjectContour].pop());
                }
            }

            return {
                index: bar.index,
                time: bar.time,
                duration: bar.pitched.duration,
                dynamics: bar.pitched.dynamics,
                phraseType: bar.pitched.phraseType,
                pitch: bar.pitched.pitch,
                globjects: globject
            };
        });

        insertSetTransformations(pitchedBars);
        deduplicateAdjacentSets(pitchedBars);

        return pitchedBars;
    }

    function filterBarsWithSets(bar) {
        return bar.phraseType !== 'rest';
    }

    function insertSetTransformations(bars) {
        var barsWithSets = bars.filter(filterBarsWithSets);

        function getMidPoint(current, next) {
            return ((next - current) * 0.5) + current;
        }

        for (var i = 0; i < barsWithSets.length; i++) {
            var pitch = barsWithSets[i].pitch;
            var newPitch = [];

            pitch.forEach(function(current, index, array) {
                var next = array[index + 1];

                newPitch.push(current);

                if (array.length !== index + 1) {
                    newPitch.push({
                        time: getMidPoint(current.time, next.time),
                        classes: [],
                        type: 'transform'
                    });
                }
            });

            barsWithSets[i].pitch = newPitch;
        }
    }

    function deduplicateAdjacentSets(bars) {
        var barsWithSets = bars.filter(filterBarsWithSets);

        for (var i = 0; i < barsWithSets.length - 1; i++) {
            var bar = barsWithSets[i];
            var barSet = bar.pitch;
            var lastSet = barSet[barSet.length - 1].classes.join();

            var nextBar = barsWithSets[i + 1];
            var nextSet = nextBar.pitch[0].classes.join();

            // NOTE Simple way to handle floating point addition rounding (.333 vs. .334, etc.)
            var adjacent = (Math.round(bar.time + bar.duration) === Math.round(nextBar.time));
            if ((lastSet === nextSet) && adjacent) {
                barSet.pop();
            }
        }
    }

    function generatePercussionPart() {

        var percussionBars = rawScoreData.filter(function(bar) {
            return bar.percussion.tempo !== null;
        });

        percussionBars = percussionBars.map(function(bar) {
            bar.percussion.rhythmIndices = [];

            for (var i = 0; i < config.numberOfPercussionParts; i++) {
                bar.percussion.rhythmIndices.push(getRhythmIndices(bar.percussion.rhythmRange));
            }

            return bar;
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
