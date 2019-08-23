import drone from "../drone";

const durations = VS.dictionary.Bravura.durations.stemless;

const main = d3.select(".main");
const wrapper = main.append("g");

drone(wrapper);

// TODO
[0, 1, 2, 3, 4].forEach(x => {
  wrapper
    .append("text")
    .style("font-family", "'Bravura'")
    .text(durations[0.25])
    .attr("dx", `${x}em`);
});

const score = [
  // existing drone/s?
  // sixteenth notes: 0 e 0 2 3 (Mahler 2 opening)--is there a pitch center?
  // wall/tremolo--is it around the pitch center?
  // semitone falls around drones, maybe the wall/texture fades over time
];
