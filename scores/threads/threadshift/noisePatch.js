export default function noisePatch(x, length, selection) {
  // TODO length will become path data?
  // TODO shape as path
  selection
    .append("rect")
    .attr("x", x)
    .attr("width", length * 0.5)
    .attr("y", 0)
    .attr("height", 25)
    .attr("fill", "#888888");
}
