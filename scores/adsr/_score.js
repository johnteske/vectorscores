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
score.timeScale = (score.totalDuration / 300);

score.bars = [0, 6.3858708756625, 10.33255612459, 16.718427000252, 27.050983124842, 37.383539249432,
    43.769410125095, 47.716095374022, 50.155281000757, 54.101966249685, 60.487837125347, 66.873708001009,
    70.820393249937, 77.206264125599, 81.152949374527, 87.538820250189, 97.871376374779, 108.20393249937,
    114.58980337503, 124.92235949962, 131.30823037528, 141.64078649987, 158.35921350013, 175.07764050038,
    185.41019662497, 195.74275274956, 212.46117974981, 229.17960675006, 239.51216287465, 245.89803375032,
    256.23058987491, 262.61646075057, 272.94901687516, 283.28157299975, 289.66744387541, 293.61412912434,
    300].map(function(bar) {
        return bar * score.timeScale;
    });

/**
 * For interpolating parameter envelopes. Scaled to 1--originally in SuperCollider as durations.
 */
score.structure = [0, 0.14586594177599999, 0.236029032, 0.381924, 0.618, 0.763970968, 1 ];

score.rehearsalLetters = [
    {letter: 'A', index : 6},
    {letter: 'B', index : 12},
    {letter: 'C', index : 18},
    {letter: 'D', index : 24},
    {letter: 'E', index : 27}
];

var durations = [0.2, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8];
var timbres = ['bartok', '(pizz.)', 'ghost', 'rolling (pizz.)', 'rolling, glassy', 'glassy', 'flutter', 'vib.', 'ord.', 'l.v.'];
var dynamics = ['f', 'mf', 'mp', 'p', 'pp', 'pp', 'p', 'mp', 'mf', 'f', 'ff'];

var envelopes = {
    phraseLength: [1, 1, 2, 3, 4, 1, 1],
    timeDispersion: [0, 0, 1, 1.5, 2, 2.5, 3],
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
    for (var i = 0, nBars = score.bars.length, lastBar = nBars - 1; i < nBars; i++) {
        var now = score.bars[i] / score.totalDuration,
            iit = getPrevNextIndicesAndT(score.structure, now),
            phrase = {};

        var endLastPhrase = 0;
        if (i > 0) {
            var lastIndex = i - 1,
                lastPhraseDuration = part[lastIndex].durations.reduce(function(a, b) { return a + b; }, 0);
            // TODO last dur is not incuded in sum?
            // var lastDur = part[lastIndex].durations[part[lastIndex].durations.length - 1];
            var lastDur = 0;
            if (part[lastIndex].durations.length > 1) {
                lastDur = part[lastIndex].durations[part[lastIndex].durations.length - 1];
            }
            endLastPhrase = part[lastIndex].startTime + lastPhraseDuration + lastDur;
        }

        var dispersion = lerpEnvelope(envelopes.timeDispersion, iit);
        dispersion = VS.getRandExcl(-dispersion, dispersion);
        dispersion *= score.timeScale;

        phrase.startTime = Math.max(score.bars[i] + dispersion, endLastPhrase);

        var timbreIndex = 0;
        if (i === 0) {
            timbreIndex = 0; // bartok
        } else if (i === lastBar) {
            timbreIndex = 9; // l.v.
        } else {
            // 1/3 chance to anticipate next timbre (and thus dynamic)
            timbreIndex = Math.round(lerpEnvelope(envelopes.timbre, iit));
            timbreIndex = VS.getWeightedItem([timbreIndex, timbreIndex + 1], [2, 1]);
        }
        phrase.timbre = timbres[timbreIndex];

        if (i === 0) {
            phrase.pitch = { // pitch center
                high: 0,
                low: 0
            };
        } else if (i === lastBar) {
            phrase.pitch = { // full range
                high: 2,
                low: -2
            };
        } else {
            phrase.pitch = {
                high: VS.clamp(roundHalf(lerpEnvelope(envelopes.pitch.high, iit) + VS.getRandExcl(-0.5, 0.5)), 0, 2),
                low: VS.clamp(roundHalf(lerpEnvelope(envelopes.pitch.low, iit) + VS.getRandExcl(-0.5, 0.5)), -2, 0)
            };
        }

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
        if (phrase.timbre === 'ghost') {
            phrase.durations.push(1.1); // to help space startTime, avoiding overlap
        }

        // also mapped to envelopes.timbre
        phrase.dynamics = [];
        phrase.dynamics[0] = dynamics[timbreIndex];
        if (i === lastBar) {
            phrase.dynamics[0] = 'ff';
        }

        if (phrase.durations.length > 1 && phrase.timbre !== 'ghost') {
            phrase.dynamics[1] = (phrase.durations[0] < 1) ? '>' : 'dim.';
        }

        phrase.articulations = []; // [">", /*dim.*/, "-", "l.v."]
        if (phraseLength > 1 && phrase.durations[0] > 0.75) { phrase.articulations[0] = '>'; }
        if (phraseLength > 2 && phrase.durations[2] < 4) { phrase.articulations[2] = '-'; }
        if (phrase.timbre === 'l.v.') { phrase.articulations[phrase.durations.length - 1] = 'l.v.'; }

        part.push(phrase);
    }
    parts.push(part);
}
