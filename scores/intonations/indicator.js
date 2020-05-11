import translate from "./translate";

export default function (selection) {
  // TODO from dirge,,march AND ad;sr
  const indicator = selection
    .append("path")
    .attr("class", "indicator")
    .attr("d", "M-6.928,0 L0,2 6.928,0 0,12 Z")
    .style("stroke", "black")
    .style("stroke-width", "1")
    .style("fill", "black")
    .style("fill-opacity", "0");

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
    blinker: blinker(indicator),
    translateX,
    translateY,
  };
}

function blinker(selection) {
  return VS.cueBlink(selection)
    .beats(3)
    .inactive(function (selection) {
      selection.style("fill-opacity", 0);
    })
    .on(function (selection) {
      selection.style("fill-opacity", 1);
    })
    .off(function (selection) {
      selection.style("fill-opacity", 0);
    })
    .down(function (selection) {
      selection.style("fill-opacity", 1);
    });
}
