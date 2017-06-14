function rangeGen(length, min, max) {
    var pcs = [];
    for (var i = 0; i < length; i++) {
        pcs.push(Math.floor(Math.random() * (max - min)) + min);
    }
    return pcs;
}

function makeGlobject() {
    var globject = {},
        dynamics = ["ppp", "pp", "p", "mp", "mf", "f", "ff", "fff"],
        newDynamics = ["", "", ""];

    globject.width = 120;

    globject.rangeEnvelope = {
        type: "midi",
        hi: rangeGen(4, 64, 127),
        lo: rangeGen(4, 0, 63),
        times: [0, 0.3, 0.5, 1]
    };

    globject.pitches = [
        {
            classes: [ 0, Math.round(VS.getRandExcl(1, 3)), Math.round(VS.getRandExcl(4, 7)) ],
            time: 0
        }
    ];

    // globject.duration = {
    //     values: [0.5, 0.75, 1],
    //     weights: [0.5, 0.25, 0.25]
    // };
    // globject.articulation = {
    //     values: [">", "_", "."],
    //     weights: [0.5, 0.25, 0.25]
    // };

    newDynamics[0] = VS.getItem(dynamics);
    // newDynamics[2] = VS.getItem(dynamics);
    // if(dynamics.indexOf(newDynamics[0]) > dynamics.indexOf(newDynamics[2])) {
    //     newDynamics[1] = "dim.";
    // } else if (dynamics.indexOf(newDynamics[0]) < dynamics.indexOf(newDynamics[2])) {
    //     newDynamics[1] = "cres.";
    // } else {
    //     newDynamics[1] = "subito " + VS.getItem(dynamics);
    //     newDynamics[2] = "";
    // }

    globject.dynamics = [
        { value: newDynamics[0], time: 0 },
        // { value: newDynamics[1], time: 0.5 },
        // { value: newDynamics[2], time: 1 }
    ];

    var durs = [0.5, 1, 1.5, 2];

    globject.phraseTexture = [
        VS.getItem(durs),
        VS.getItem(durs),
        VS.getItem(durs)
    ];

    return globject;
}
// var score = [];
// for (var i = 0; i < 10; i++) {
//     score.push([makeGlobject()]);
// }
