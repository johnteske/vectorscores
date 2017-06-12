function randRangeGenerator() {
    return VS.getItem([rangeGen, wedgeRangeGen, stepRangeGen]);
}

function makeGlobject() {
    var hiRangeGen = randRangeGenerator(),
        loRangeGen = randRangeGenerator(),
        dynamics = ["ppp", "pp", "p", "mp", "mf", "f", "ff", "fff"],
        newDynamics = ["", "", ""];

    theGlob.width = Math.round(VS.getRandExcl(100, 200));

    theGlob.setRangeEnvelopes(
        "midi",
        hiRangeGen(4, 64, 127),
        loRangeGen(4, 0, 63),
        [0, 0.3, 0.5, 1]
    );

    theGlob.setPitchClassSets(
        [
            [ 0, Math.round(VS.getRandExcl(1, 3)) ],
            [ 0, Math.round(VS.getRandExcl(1, 3)), Math.round(VS.getRandExcl(4, 7)) ]
        ],
        [0, (Math.random() * 0.2) + 0.4]
    );

    // theGlob.duration = {
    //     values: [0.5, 0.75, 1],
    //     weights: [0.5, 0.25, 0.25]
    // };
    // theGlob.articulation = {
    //     values: [">", "_", "."],
    //     weights: [0.5, 0.25, 0.25]
    // };

    newDynamics[0] = VS.getItem(dynamics);
    newDynamics[2] = VS.getItem(dynamics);
    if(dynamics.indexOf(newDynamics[0]) > dynamics.indexOf(newDynamics[2])) {
        newDynamics[1] = "dim.";
    } else if (dynamics.indexOf(newDynamics[0]) < dynamics.indexOf(newDynamics[2])) {
        newDynamics[1] = "cres.";
    } else {
        newDynamics[1] = "subito " + VS.getItem(dynamics);
        newDynamics[2] = "";
    }

    theGlob.setDynamics(newDynamics, [0, 0.5, 1]);

    var durs = [0.5, 1, 1.5, 2];

    theGlob.phraseTexture = [
        VS.getItem(durs),
        VS.getItem(durs),
        VS.getItem(durs)
    ];

    return theGlob;
}
makeGlobject();
