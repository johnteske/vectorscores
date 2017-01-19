// adapted from original SuperCollider code

var width = 640,
    height = 640,
    timePoints = [ 0, 6.3858708756625, 10.33255612459, 16.718427000252, 27.050983124842, 37.383539249432, 43.769410125095, 47.716095374022, 50.155281000757, 54.101966249685, 60.487837125347, 66.873708001009, 70.820393249937, 77.206264125599, 81.152949374527, 87.538820250189, 97.871376374779, 108.20393249937, 114.58980337503, 124.92235949962, 131.30823037528, 141.64078649987, 158.35921350013, 175.07764050038, 185.41019662497, 195.74275274956, 212.46117974981, 229.17960675006, 239.51216287465, 245.89803375032, 256.23058987491, 262.61646075057, 272.94901687516, 283.28157299975, 289.66744387541, 293.61412912434, 300 ],
    // for interpolating parameter envelopes, scaled to 1. originally in SuperCollider as durations, not points in time
    structurePoints = [0, 0.14586594177599999, 0.236029032, 0.381924, 0.618, 0.763970968, 1 ],
    scoreLength = timePoints[timePoints.length - 1];

function lerp(v0, v1, t) {
    return (1 - t) * v0 + t * v1;
}
function lerpPoints(v0, v1, t0, t1) {
    var t = (t0 / t1);
    return (1 - t) * v0 + t * v1;
}
function getPrevNextValue(array, val) {
    for (var i = 0; i < array.length; i++) {
        if (val >= array[i-1] && val <= array[i]) {
            return [ array[i-1], array[i] ];
        }
    }
}

// // ~durs = [0.2,0.25,0.5,0.75,1,1.5,2,3,4,6,8];

var envelopes = {
    durations: [1,1,2,3,4,1,1]
};

// ~durhi = InterplEnv([0.2, 0.75, 1.5, 3, 6, 4, 4], m, [\lin]);
// ~durlo = InterplEnv([0.2, 0.5,  0.5, 1.0, 2, 3, 3], m, [\lin]);
// ~tdisp = InterplEnv([0,0,1,1.5,2,2.5,1], m, [\lin]); // in seconds?
// ~timbre = InterplEnv([0,2,4,5,6,8,9], m, [\lin]);
// // ~timbres = ["bartok", "pizz.", "ghost", "rolling pizz.", "bow hair pull", "sul pont.", "flutter", "vib.", "ord.", "l.v."];
// ~noteshi = InterplEnv([0,  0,  0.5,  1,  1.5,  2,  2], m, [\lin]);
// ~noteslo = InterplEnv([0, -0.5, -1, -1.5, -2, -2, -2], m, [\lin]);

// // ~score = [];
// // 4.do({|part|
var part = [];
for (var i = 0; i < timePoints.length; i++) {
        var now, durations, durationsLength, timeDispersion, timbre, pitch;
		now = timePoints[i] / timePoints[timePoints.length - 1];
console.log(
    now,
    getPrevNextValue(structurePoints, now)
);
        timeDispersion = 0; // ~tdisp.at(now);
		timbre = "bartok"; // 0 // ~timbre.at(now);

		pitch = {
            high: 2, // ~noteshi.at(now);
		    low: -2 // ~noteslo.at(now);
        };

        durations = [];
		durationsLength = 2; // ~strlength.at(now).round(1);
        for (var j = 0; j < durationsLength; j++) {
		// 	// var thisdur = rrand(~durlo.at(now), ~durhi.at(now));
		// 	// thisdur = thisdur.nearestInList(~durs);
		// 	// thisstring = thisstring.add(thisdur);
            durations.push(1);
		};
		part.push([timeDispersion, durations, timbre, pitch.high, pitch.low]);
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
