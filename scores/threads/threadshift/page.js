export default function(parent) {
  const page = parent.append("g");
  let center = null;

  function calculateCenter() {
    const width = parseInt(parent.style("width"), 10);
    center = width * 0.5;
    return center;
  }

  function getCenter() {
    return center;
  }

  function scrollTo(x) {
    page
      .transition()
      .ease(d3.easeLinear)
      .duration(duration)
      .attr("transform", `translate(${center - x},0)`);
  }

  return {
    element: page,
    calculateCenter,
    getCenter,
    scrollTo
  };
}
