import drone from "../drone";
import translate from "../translate";

const durations = VS.dictionary.Bravura.durations.stemless;

const main = d3.select(".main");
const wrapper = main.append("g");

//drone(wrapper);

function sixteenths(selection) {
  const g = selection.append("g").attr("stroke", "black");

  const spacing = 5;

  [0, -1, 0, 2, 3].forEach((y, i) => {
    const x = i * spacing;

    g.append("line")
      .attr("x1", x)
      .attr("x2", x)
      .attr("y1", 0 - y)
      .attr("y2", 10 - y);
  });

  g.append("line")
    .attr("x1", 0)
    .attr("x2", 3 * spacing)
    .attr("y1", 0)
    .attr("y2", 0 - 2)
    .attr("stroke-width", 2);

  g.append("line")
    .attr("x1", 0)
    .attr("x2", 3 * spacing)
    .attr("y1", 0)
    .attr("y1", 3)
    .attr("y2", 3 - 2)
    .attr("stroke-width", 2);

  return g;
}

// TODO
sixteenths(wrapper).attr("transform", "translate(0, 50) scale(2,2)");

translate(100, 50, sixteenths(wrapper));

const score = [
  // existing drone/s?
  // sixteenth notes: 0 e 0 2 3 (Mahler 2 opening)--is there a pitch center?
  // wall/tremolo--is it around the pitch center?
  // semitone falls around drones, maybe the wall/texture fades over time
];
