import { rangeGen, stepRangeGen, wedgeRangeGen } from "./_rangeGen.js";

function randRangeGenerator() {
  return VS.getItem([rangeGen, wedgeRangeGen, stepRangeGen]);
}

function makeGlobject() {
  var globject = {},
    hiRangeGen = randRangeGenerator(),
    loRangeGen = randRangeGenerator(),
    dynamics = ["ppp", "pp", "p", "mp", "mf", "f", "ff", "fff"],
    newDynamics = ["", "", ""];

  globject.width = Math.round(VS.getRandExcl(100, 200));

  globject.rangeEnvelope = {
    type: "midi",
    hi: hiRangeGen(4, 64, 127),
    lo: loRangeGen(4, 0, 63),
    times: [0, 0.3, 0.5, 1],
  };

  var pcset = VS.pitchClass.transpose(VS.getItem(VS.trichords), "random");

  globject.pitches = [
    {
      classes: pcset.slice(0, 2),
      time: 0,
    },
    {
      classes: pcset,
      time: 0.5,
    },
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
  newDynamics[2] = VS.getItem(dynamics);
  if (dynamics.indexOf(newDynamics[0]) > dynamics.indexOf(newDynamics[2])) {
    newDynamics[1] = "dim.";
  } else if (
    dynamics.indexOf(newDynamics[0]) < dynamics.indexOf(newDynamics[2])
  ) {
    newDynamics[1] = "cres.";
  } else {
    newDynamics[1] = "subito " + VS.getItem(dynamics);
    newDynamics[2] = "";
  }

  globject.dynamics = [
    { value: newDynamics[0], time: 0 },
    { value: newDynamics[1], time: 0.5 },
    { value: newDynamics[2], time: 1 },
  ];

  var durs = [0.5, 1, 1.5, 2];

  globject.phraseTexture = [
    VS.getItem(durs),
    VS.getItem(durs),
    VS.getItem(durs),
  ];

  return globject;
}

export default (function () {
  var _score = [];
  for (var i = 0; i < 8; i++) {
    _score.push([makeGlobject()]);
  }
  return _score;
})();
