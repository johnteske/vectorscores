const durations = VS.dictionary.Bravura.durations.stemless;

export default function longTone(selection, x, y, length) {
  const group = selection.append("g");

  group.attr("transform", `translate(${x}, ${y})`);

  group
    .append("text")
    .attr("class", "bravura")
    .text(durations[4]);

  group
    .append("line")
    .attr("x1", "0.5em")
    .attr("x2", length);

  return group;
}
