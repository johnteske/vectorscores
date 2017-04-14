function lerp(v0, v1, t) {
    return (1 - t) * v0 + t * v1;
}
function getPrevNextIndices(array, val) {
    for (var i = 0; i < array.length; i++) {
        if (val >= array[i - 1] && val <= array[i]) {
            return [i - 1, i];
        }
    }
}
function getPrevNextIndicesAndT(array, time) {
    var indices = getPrevNextIndices(array, time),
        v0 = array[indices[0]],
        v1 = array[indices[1]],
        t = (time - v0) / (v1 - v0);
    return [indices[0], indices[1], t];
}
function lerpEnvelope(env, iit) {
    return lerp(env[iit[0]], env[iit[1]], iit[2]);
}
function roundHalf(num) {
    return Math.round(num * 2) / 2;
}

/**
 * While scalable, the original work was timed at 300 seconds (5 minutes)
 */
score.totalDuration = 300;

score.bars = [ 0, 6.3858708756625, 10.33255612459, 16.718427000252, 27.050983124842, 37.383539249432, 43.769410125095, 47.716095374022, 50.155281000757, 54.101966249685, 60.487837125347, 66.873708001009, 70.820393249937, 77.206264125599, 81.152949374527, 87.538820250189, 97.871376374779, 108.20393249937, 114.58980337503, 124.92235949962, 131.30823037528, 141.64078649987, 158.35921350013, 175.07764050038, 185.41019662497, 195.74275274956, 212.46117974981, 229.17960675006, 239.51216287465, 245.89803375032, 256.23058987491, 262.61646075057, 272.94901687516, 283.28157299975, 289.66744387541, 293.61412912434, 300 ];

/**
 * For interpolating parameter envelopes. Scaled to 1--originally in SuperCollider as durations.
 */
score.structure = [0, 0.14586594177599999, 0.236029032, 0.381924, 0.618, 0.763970968, 1 ];

score.rehearsalLetters = [
    {letter: "A", index : 6},
    {letter: "B", index : 12},
    {letter: "C", index : 18},
    {letter: "D", index : 24},
    {letter: "E", index : 27}
];

var durations = [0.2, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8];
var timbres = ["bartok", "pizz.", "ghost", "rolling pizz.", "bow hair pull", "sul pont.", "flutter", "vib.", "ord.", "l.v."];
var dynamics = ["f", "mf", "mp", "p", "pp", "pp", "p", "mp", "mf", "f", "ff"];

var envelopes = {
    phraseLength: [1, 1, 2, 3, 4, 1, 1],
    timeDispersion: [0, 0, 1, 1.5, 2, 2.5, 1],
    pitch: {
        high: [0, 0, 0.5, 1, 1.5, 2, 2],
        low: [0, -0.5, -1, -1.5, -2, -2, -2]
    },
    duration: {
        high: [0.2, 0.75, 1.5, 3, 6, 4, 4],
        low: [0.2, 0.5, 0.5, 1.0, 2, 3, 3]
    },
    timbre: [0, 2, 4, 5, 6, 8, 9]
};

var parts = [];
for (var p = 0; p < numParts; p++) {
    var part = [];
    for (var i = 0; i < score.bars.length; i++) {
        var now = score.bars[i] / score.totalDuration,
            iit = getPrevNextIndicesAndT(score.structure, now),
            phrase = {};

        phrase.timeDispersion = lerpEnvelope(envelopes.timeDispersion, iit);

        phrase.timbre = timbres[Math.round(lerpEnvelope(envelopes.timbre, iit))];

        phrase.pitch = {
            high: roundHalf(lerpEnvelope(envelopes.pitch.high, iit)),
            low: roundHalf(lerpEnvelope(envelopes.pitch.low, iit))
        };

        var phraseLength = Math.round(lerpEnvelope(envelopes.phraseLength, iit));
        phrase.durations = [];

        if (i > 0) { // if not the first bar, calculate note durations
            for (var j = 0; j < phraseLength; j++) {
                var highDur = lerpEnvelope(envelopes.duration.high, iit);
                var lowDur = lerpEnvelope(envelopes.duration.low, iit);

                // find a (random) duration between these envelopes
                var randDur = VS.getRandExcl(lowDur, highDur);
                // match that to the closest durations
                var closeDurIndices = getPrevNextIndices(durations, randDur);
                // and pick one of the two
                var thisDur = durations[VS.getItem(closeDurIndices)];
                phrase.durations.push(thisDur);
            }
        } else { // if first bar, force x notehead
            phrase.durations.push(0);
        }

        // also mapped to envelopes.timbre
        // TODO also add dim. to "ghost"s
        // TODO these values are very strict--add variation, like original score
        phrase.dynamics = [];
        phrase.dynamics[0] = dynamics[Math.round(lerpEnvelope(envelopes.timbre, iit))];
        if (phraseLength > 1) {
            if (phrase.durations[0] < 1) {
                phrase.dynamics[1] = ">";
            } else {
                phrase.dynamics[1] = "dim.";
            }
        }

        // TODO "let vibrate" as fourth articulation, "release"
        // TODO "l.v." is not being set as a timbre value
        phrase.articulations = []; // [">", /*dim.*/, "-", "l.v."]
        if (phraseLength > 1 && phrase.durations[0] > 0.75) { phrase.articulations[0] = ">"; }
        if (phraseLength > 2 && phrase.durations[2] < 4) { phrase.articulations[2] = "-"; }
        if (phrase.timbre === "l.v.") { phrase.articulations[phrase.durations.length - 1] = "l.v."; }

        part.push(phrase);
    }
    parts.push(part);
}
