import drone from "../drone";

const durations = VS.dictionary.Bravura.durations.stemless;

const main = d3.select(".main");
const wrapper = main.append("g");

drone(wrapper);

function sixteenths(selection) {
  const g = selection.append("g").attr("stroke", "black");

  [0, 1, 2, 3, 4].forEach(x => {
    g.append("line")
      .attr("x1", x * 5)
      .attr("x2", x * 5)
      .attr("y1", 0)
      .attr("y2", 10);
  });

  g.append("line")
    .attr("x1", 0)
    .attr("x2", 3 * 5)
    .attr("y1", 0)
    .attr("y2", 0)
    .attr("stroke-width", 2);

  g.append("line")
    .attr("x1", 0)
    .attr("x2", 3 * 5)
    .attr("y1", 3)
    .attr("y2", 3)
    .attr("stroke-width", 2);

  return g;
}

// TODO
sixteenths(wrapper);

const score = [
  // existing drone/s?
  // sixteenth notes: 0 e 0 2 3 (Mahler 2 opening)--is there a pitch center?
  // wall/tremolo--is it around the pitch center?
  // semitone falls around drones, maybe the wall/texture fades over time
];
