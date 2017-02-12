function lerp(v0, v1, t) {
    return (1 - t) * v0 + t * v1;
}
function getPrevNextIndices(array, val) {
    for (var i = 0; i < array.length; i++) {
        if (val >= array[i-1] && val <= array[i]) {
            return [i-1, i];
        }
    }
}
function getPrevNextIndicesAndT(array, val) {
    var indices = getPrevNextIndices(array, val);
    return [indices[0], indices[1], val - array[indices[0]]];
}
function roundHalf(num) {
    return Math.round(num*2)/2;
}
function lerpEnvelope(env, iit) {
    return lerp(env[iit[0]], env[iit[1]], iit[2]);
}

var durations = [0.2,0.25,0.5,0.75,1,1.5,2,3,4,6,8];
var timbres = ["bartok", "pizz.", "ghost", "rolling pizz.", "bow hair pull", "sul pont.", "flutter", "vib.", "ord.", "l.v."];

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
    for (var i = 0; i < timePoints.length; i++) {
        var now = timePoints[i] / scoreLength,
            iit = getPrevNextIndicesAndT(structurePoints, now),
            phrase = {};

        phrase.timeDispersion = lerpEnvelope(envelopes.timeDispersion, iit);

        phrase.timbre = timbres[Math.round(lerpEnvelope(envelopes.timbre, iit))];

        phrase.pitch = {
            high: roundHalf(lerpEnvelope(envelopes.pitch.high, iit)),
            low: roundHalf(lerpEnvelope(envelopes.pitch.low, iit))
        };

        var phraseLength = Math.round(lerpEnvelope(envelopes.phraseLength, iit));
        phrase.durations = [];

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

        part.push(phrase);
    }
    parts.push(part);
}
