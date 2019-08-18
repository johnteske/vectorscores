import translate from "../translate";

export default function(selection) {
  const indicator = selection
    .append("line")
    .attr("y1", 0)
    .attr("y2", 100);

  let x = 0;
  let y = 0;

  function translateX(_) {
    x = _;
    translate(x, y, indicator);
  }

  function translateY(_) {
    y = _;
    translate(x, y, indicator);
  }

  return {
    element: indicator,
    translateX,
    translateY
  };
}
