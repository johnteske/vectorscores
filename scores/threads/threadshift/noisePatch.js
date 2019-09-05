export default function noisePatch(x, length, selection) {
  // TODO length will become path data?
  // TODO shape as path
  return selection
    .append("rect")
    .attr("x", x)
    .attr("width", length * 0.5)
    .attr("y", -10) // center
    .attr("height", 20)
    .attr("fill", "pink")
    .style("opacity", "0.5");
}
