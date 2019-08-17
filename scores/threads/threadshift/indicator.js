export default function(selection) {
  const indicator = selection
    .append("line")
    .attr("y1", 0)
    .attr("y2", 100);

  function translateX(x) {
    indicator.attr("transform", `translate(${x},0)`);
  }

  return {
    translateX
  };
}
