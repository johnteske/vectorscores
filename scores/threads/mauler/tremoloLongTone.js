export default function(selection) {
  const g = selection.append("g");

  g.append("text")
    .text("\ue227")
    .attr("dy", "-0.5em")
    .attr("class", "bravura wip");

  g.append("line")
    .attr("stroke", "black")
    .attr("x2", 100); // TODO

  return g;
}
