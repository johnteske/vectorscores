// adapted from original SuperCollider code

var width = 640,
    height = 640,
    timePoints = [ 0, 6.3858708756625, 10.33255612459, 16.718427000252, 27.050983124842, 37.383539249432, 43.769410125095, 47.716095374022, 50.155281000757, 54.101966249685, 60.487837125347, 66.873708001009, 70.820393249937, 77.206264125599, 81.152949374527, 87.538820250189, 97.871376374779, 108.20393249937, 114.58980337503, 124.92235949962, 131.30823037528, 141.64078649987, 158.35921350013, 175.07764050038, 185.41019662497, 195.74275274956, 212.46117974981, 229.17960675006, 239.51216287465, 245.89803375032, 256.23058987491, 262.61646075057, 272.94901687516, 283.28157299975, 289.66744387541, 293.61412912434, 300 ],
    scoreLength = timePoints[timePoints.length - 1],
    // for interpolating parameter envelopes, scaled to 1. originally in SuperCollider as durations, not points in time
    structurePoints = [0, 0.14586594177599999, 0.236029032, 0.381924, 0.618, 0.763970968, 1 ];

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
};

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

// // ~score = [];
// // 4.do({|part|
var part = [];
for (var i = 0; i < timePoints.length; i++) {
        var now, iit, phrase, notes, phraseLength, timeDispersion, timbre, pitch;
		now = timePoints[i] / scoreLength;

        iit = getPrevNextIndicesAndT(structurePoints, now);

        timeDispersion = lerpEnvelope(envelopes.timeDispersion, iit);

        timbre = timbres[Math.round(lerpEnvelope(envelopes.timbre, iit))];

		pitch = {
            high: roundHalf(lerpEnvelope(envelopes.pitch.high, iit)),
		    low: roundHalf(lerpEnvelope(envelopes.pitch.low, iit))
        };

        phraseLength = Math.round(lerpEnvelope(envelopes.phraseLength, iit));
        notes = [];

        for (var j = 0; j < phraseLength; j++) {
            var highDur = lerpEnvelope(envelopes.duration.high, iit);
            var lowDur = lerpEnvelope(envelopes.duration.low, iit);

            // find a (random) duration between these envelopes
            var randDur = VS.getRandExcl(lowDur, highDur);
            // match that to the closest durations
			var closeDurIndices = getPrevNextIndices(durations, randDur);
            // and pick one of the two
            var thisDur = durations[VS.getItem(closeDurIndices)];
            notes.push(thisDur);
		};

        phrase = [timeDispersion, notes, timbre, pitch.high, pitch.low];
        console.log(phrase);
		part.push(phrase);
}
// 	// ~score = ~score.add(thispart);
// // });

var main = d3.select(".main")
    .attr("height", height)
    .attr("width", width);

main.append("g")
    .selectAll("text")
    .data(timePoints)
    .enter()
    .append("text")
    .text(function(d, i) {
        return "|"; // part[i][0];
    })
    .attr("transform", function(d) {
        var x = (width * d) / scoreLength,
            y = height * 0.5;
        return "translate(" + x + ", " + y + ")";
    });

main.append("g")
    .selectAll("text")
    .data(structurePoints)
    .enter()
    .append("text")
    .text("|")
    .style("fill", "red")
    .attr("transform", function(d) {
        var x = (width * d),
            y = height * 0.5;
        return "translate(" + x + ", " + y + ")";
    });
