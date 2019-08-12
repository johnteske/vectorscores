(function () {
  'use strict';

  const data = [{ x: 0, y: 50 }, { x: 0, y: 100 }];

  function drone(selection) {
    selection
      .selectAll(".drone")
      .data(data)
      .enter()
      .append("line")
      .attr("class", "drone")
      .attr("x1", 0)
      .attr("x2", 100)
      .attr("y1", d => d.y)
      .attr("y2", d => d.y);
  }

  const main = d3.select(".main");
  const wrapper = main.append("g");

  drone(wrapper);

  // shiver--or shudder?
  function shiver(selection) {
    const group = selection.append("g").attr("transform", "translate(50,50)");

    group
      .append("text")
      .text("cres.")
      .attr("x", 0);

    group
      .append("text")
      .text("///")
      .attr("x", 50);

    group
      .append("text")
      .text("decres.")
      .attr("x", 100);
  }

  shiver(wrapper);

  function moan(selection) {
    selection
      .append("text")
      .text("LNP, subharmonic")
      .attr("dy", "2em");
  }

  moan(wrapper);

}());
