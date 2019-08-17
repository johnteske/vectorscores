import drone from "../drone";

const main = d3.select(".main");
const wrapper = main.append("g");

drone(wrapper);

const score = [
  // small, single note
  // accented "ding", like a bell--maybe a split chord, l.v.
  // dissonant cluster, within an octave or octave and a half
];

// if there are acive drones, do they fade/pause,
// then "reveal" and continue?
