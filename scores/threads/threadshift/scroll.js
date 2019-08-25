export default function(selection) {
  const scroll = selection.append("g");

  let center = null;

  function setCenter(_) {
    center = _;
  }

  function scrollTo(x, duration) {
    scroll
      .transition()
      .ease(d3.easeLinear)
      .duration(duration)
      .attr("transform", `translate(${center - x},0)`);
  }

  return {
    element: scroll,
    setCenter,
    scrollTo
  };
}
