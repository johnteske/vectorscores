export default function sixteenths(selection) {
  const g = selection.append("g").attr("stroke", "black");

  const stemHeight = 10;
  const spacing = 5;

  [0, -1, 0, 2, 3].forEach((y, i) => {
    const x = i * spacing;

    g.append("line")
      .attr("x1", x)
      .attr("x2", x)
      .attr("y1", -1 * y)
      .attr("y2", -1 * y - stemHeight);
  });

  g.append("line")
    .attr("x1", 0)
    .attr("x2", 3 * spacing)
    .attr("y1", -stemHeight)
    .attr("y2", -stemHeight - 2)
    .attr("stroke-width", 2);

  g.append("line")
    .attr("x1", 0)
    .attr("x2", 3 * spacing)
    .attr("y1", 0)
    .attr("y1", -stemHeight + 3)
    .attr("y2", -stemHeight + 3 - 2)
    .attr("stroke-width", 2);

  return g;
}
