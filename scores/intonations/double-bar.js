export default function (selection, height) {
  const g = selection.append("g");

  g.append("line").attr("y1", 0).attr("y2", height).attr("stroke-width", 1);

  g.append("line")
    .attr("x1", 3)
    .attr("x2", 3)
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke-width", 2);

  return g;
}
