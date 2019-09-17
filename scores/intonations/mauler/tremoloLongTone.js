import longTone from "../longTone";

export default function(selection) {
  const g = longTone(selection, 0, 0, 100) // TODO length TODO
    .attr("stroke", "black");

  g.append("text")
    .text("\ue227")
    .attr("dx", "0.25em")
    .attr("dy", "-0.5em")
    .attr("class", "bravura");

  return g;
}
