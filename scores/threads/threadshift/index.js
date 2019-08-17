import drone from "../drone";

const main = d3.select(".main");
const wrapper = main.append("g");

// drone(wrapper);

var durations = VS.dictionary.Bravura.durations.stemless;

function longTone(selection) {
  const group = selection.append("g");

  group.attr("transform", "translate(0, 50)")

  group
    .append("text")
    .attr("class", "bravura")
    .text(durations[4]);

  group
    .append("line")
    .attr("x1", "0.5em")
    .attr("x2", 50)
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
