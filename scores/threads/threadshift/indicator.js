export default function(selection) {
  const indicator = selection
    .append("line")
    .attr("y1", 0)
    .attr("y2", 100);

  let x = 0;
  let y = 0;

  function translate(x, y) {
    indicator.attr("transform", `translate(${x},${y})`);
  }

  return {
    element: indicator,
    translateX: newX => {
      x = newX;
      translate(newX, y);
    },
    translateY: newY => {
      y = newY;
      translate(x, newY);
    }
  };
}
