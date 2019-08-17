import drone from "../drone";

const main = d3.select(".main");
const wrapper = main.append("g");

drone(wrapper);

const score = [
  // existing drone/s?
  // sixteenth notes: 0 e 0 2 3 (Mahler 2 opening)--is there a pitch center?
  // wall/tremolo--is it around the pitch center?
  // semitone falls around drones, maybe the wall/texture fades over time
];
