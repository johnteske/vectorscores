function stepRangeGen(length, min, max, disp) {
    var pcs = [], thispc, lmax, lmin;
    disp = disp || 10;
    min += disp;
    max -= disp;
    thispc = Math.floor(Math.random() * (max - min)) + min; // initial selection
    for (var i = 0; i < length; i++) {
        lmax = Math.min(thispc + disp, max);
        lmin = Math.max(thispc - disp, min);
        thispc = Math.floor(Math.random() * (lmax - lmin)) + lmin;
        pcs.push(thispc);
    }
    return pcs;
}

function makeGlobject() {
    var globject = {},
        dynamics = ["ppp", "pp", "p", "mp", "mf", "f", "ff", "fff"],
        globjectType = VS.getWeightedItem(["globject", "cluster"], [3, 1]);

    globject.width = 120;

    var rangeFilter = VS.getRandExcl(0.67, 1);
    var rangeTimes = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
        .filter(function(t) {
            var coin = Math.random() > rangeFilter;
            return coin || t === 0 || t === 1;
        });

    var hiRange,
        loRange;
    if (globjectType === "globject") {
        hiRange = stepRangeGen(rangeTimes.length, 85, 127, 10);
        loRange = stepRangeGen(rangeTimes.length, 0, 42, 10);
    } else {
        hiRange = stepRangeGen(rangeTimes.length, 81, 86, 1);
        loRange = stepRangeGen(rangeTimes.length, 37, 42, 1);
    }
    globject.rangeEnvelope = {
        type: "midi",
        hi: hiRange,
        lo: loRange,
        times: rangeTimes
    };

    globject.pitches = [
        {
            classes: [ 0, Math.round(VS.getRandExcl(1, 3)), Math.round(VS.getRandExcl(4, 7)) ],
            time: 0
        }
    ];

    globject.dynamics = [
        { value: VS.getItem(dynamics), time: 0 }
    ];

    var durs = [0.5, 1, 1.5, 2];

    if (globjectType !== "cluster") {
        globject.phraseTexture = [
            VS.getItem(durs),
            VS.getItem(durs),
            VS.getItem(durs)
        ];
    } else {
        // TODO fix bug: if phraseTexture is empty [], range path is mutated to match next globject's range path
        globject.phraseTexture = [4];
    }

    return globject;
}
// var score = [];
// for (var i = 0; i < 10; i++) {
//     score.push([makeGlobject()]);
// }
