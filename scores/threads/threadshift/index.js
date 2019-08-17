import drone from "../drone";

const main = d3.select(".main");
const wrapper = main.append("g");

// drone(wrapper);

var durations = VS.dictionary.Bravura.durations.stemless;
console.log(durations);
function longTone(selection) {
  selection
    .append("text")
    .attr("class", "bravura")
    .text(durations[4]);
}

longTone(wrapper);

const score = [
  // solo long tone (p), with accent
  // crescendos to mf
  // spike
  // railroad tracks
  // solo part drops below and ensemble plays ghost of former long tone
  // threads are revealed by ensemble as the solo line becomes stable
];
