export default function noisePatch(x, length, selection) {
  // TODO length will become path data?
  // TODO shape as path
  const h = 20; // TODO set height, for now
  const y = -0.5 * h; // to center

  const g = selection.append("g")

  g
    .append("rect")
    .attr("x", x)
    .attr("width", length * 0.5)
    .attr("y", y)
    .attr("height", h)
    .attr("stroke", "blue")
    .attr("fill", "none");

  const x2 = x + (length * 0.5);
  const y2 = y + h;

  g.append("line")
    .attr("class", "wip")
    .attr("x1", x)
    .attr("x2", x2)
    .attr("y1", y)
    .attr("y2", y2);

  g.append("line")
    .attr("class", "wip")
    .attr("x1", x)
    .attr("x2", x2)
    .attr("y1", y2)
    .attr("y2", y);

  return g;
}
