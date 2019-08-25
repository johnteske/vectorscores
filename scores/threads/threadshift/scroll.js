export default function(selection) {
  const scroll = selection.append("g");

  let _center = null;
  let _y = 0;

  function setCenter(_) {
    _center = _;
  }

  function scrollTo(x, duration) {
    scroll
      .transition()
      .ease(d3.easeLinear)
      .duration(duration)
      .attr("transform", `translate(${_center - x},${_y})`);
  }

  function y(_) {
    _y = _;
  }

  return {
    element: scroll,
    setCenter,
    scrollTo,
    y
  };
}
